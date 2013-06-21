define(
[
"underscore",
"moment",
"backbone"
],
function(_, moment, Backbone) {
	var transactions = [
		{
			name: 'Salary',
			amount: 2369,
			start: moment('2013-01-01'),
			end: null,
			type: 'income',
			unit: 'months',
			every: 1
		}, {
			name: 'Salary',
			amount: 2369,
			start: moment('2013-01-15'),
			end: null,
			type: 'income',
			unit: 'months',
			every: 1
		},
		{
			name: 'Rent',
			amount: 1403,
			start: moment('2013-01-01'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Optimum online',
			amount: 45,
			start: moment('2013-01-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Verizon wireless',
			amount: 104,
			start: moment('2013-01-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Dollar shave club',
			amount: 6,
			start: moment('2013-02-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 2
		}, {
			name: 'Spotify',
			amount: 5,
			start: moment('2013-02-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Netflix',
			amount: 8,
			start: moment('2013-01-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Rackspace',
			amount: 12,
			start: moment('2013-01-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Weed',
			amount: 340,
			start: moment('2013-05-03'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 3
		}, {
			name: 'Groceries',
			amount: 40,
			start: moment('2013-01-06'),
			end: null,
			type: 'expense',
			unit: 'weeks',
			every: 1
		}, {
			name: 'Laundry',
			amount: 15,
			start: moment('2013-01-12'),
			end: null,
			type: 'expense',
			unit: 'weeks',
			every: 2
		}, {
			name: 'Lunch',
			amount: 40,
			start: moment('2013-01-04'),
			end: null,
			type: 'expense',
			unit: 'weeks',
			every: 1
		}, {
			name: 'Dinner',
			amount: 400,
			start: moment('2013-01-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Big loan',
			amount: 385,
			start: moment('2013-01-09'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Small loan',
			amount: 225,
			start: moment('2013-01-17'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Gym',
			amount: 90,
			start: moment('2013-04-11'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Haircut',
			amount: 17,
			start: moment('2013-02-20'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 2
		}, {
			name: 'Betterment',
			amount: 810,
			start: moment('2013-07-08'),
			end: null,
			type: 'expense',
			unit: 'months',
			every: 1
		}, {
			name: 'Cash',
			amount: 70,
			start: moment('2013-01-05'),
			end: null,
			type: 'expense',
			unit: 'weeks',
			every: 1
		}, {
			name: 'Other Amex',
			amount: 100,
			start: moment('2013-01-05'),
			end: null,
			type: 'expense',
			unit: 'weeks',
			every: 1
		}, {
			name: 'NJ House',
			amount: 400,
			start: moment('2013-06-22'),
			end: moment('2013-06-23'),
			type: 'expense',
			unit: 'months',
			every: 1
		}
	];


	return Backbone.Model.extend({
		defaults: {
			currentBalance: 1000,
			transactions: new Backbone.Collection([])
		},

		initialize: function() {
			this._init_data();

			this._transactions = transactions;

			this.on('change:currentBalance', function() {
				var diff = this.get('currentBalance') - this._previousAttributes['currentBalance'];

				this._data.each(function(d) {
					d.set('balance', d.get('balance') + diff);
				});
				this.trigger('change:data');
			});

			this.get('transactions').on('add', function(txn) {
				var total_change = 0,
					dates = txn.get('oneTime')
						? [txn.get('start')]
						: txn.dates(this.get('start'), this.get('end'));

				this._update_data(dates, txn.signedAmount());

				txn.on('change:amount', function() {
					var diff = txn.signedAmount() - txn.signedAmount(txn._previousAttributes['amount']);
						dates = txn.dates(this.get('start'), this.get('end'));

					this._update_data(dates, diff);
				}, this);

			}, this);
		},

		_update_data: function(dates, amount) {
			var total_change = 0;

			this._data.each(function(d, i) {
				var date = this.get('start').clone().add('days', i);
				if (date.isSame(dates[0])) {
					total_change += amount;
					dates.shift();
				}

				d.set('balance', d.get('balance') + total_change);
			}, this);
			this.trigger('change:data');
		},

		_init_data: function() {
			var data = new (Backbone.Collection.extend({
					comparator: function(point) {
						return point.get('date').toDate().getTime();
					}
				}))(),
				date = this.get('start').clone();

			while (date <= this.get('end')) {
				var point = new Backbone.Model({
					date: date.clone().startOf('day'),
					balance: this.get('currentBalance')
				});

				data.add(point);
				date.add('days', 1);
			}

			this._data = data;
		}
	});
});