define(
[
"underscore",
"moment",
"backbone"
],
function(_, moment, Backbone) {
	var transactions = [
		{
			name: 'Rent',
			amount: -1403,
			start: moment('2013-01-01'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Optimum online',
			amount: -45,
			start: moment('2013-01-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Verizon wireless',
			amount: -104,
			start: moment('2013-01-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Dollar shave club',
			amount: -6,
			start: moment('2013-02-11'),
			end: null,
			unit: 'months',
			every: 2
		}, {
			name: 'Spotify',
			amount: -5,
			start: moment('2013-02-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Netflix',
			amount: -8,
			start: moment('2013-01-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Rackspace',
			amount: -12,
			start: moment('2013-01-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Weed',
			amount: -340,
			start: moment('2013-05-03'),
			end: null,
			unit: 'months',
			every: 3
		}, {
			name: 'Groceries',
			amount: -25,
			start: moment('2013-01-06'),
			end: null,
			unit: 'weeks',
			every: 1
		}, {
			name: 'Laundry',
			amount: -15,
			start: moment('2013-01-12'),
			end: null,
			unit: 'weeks',
			every: 2
		}, {
			name: 'Lunch',
			amount: -40,
			start: moment('2013-01-04'),
			end: null,
			unit: 'weeks',
			every: 1
		}, {
			name: 'Dinner',
			amount: -400,
			start: moment('2013-01-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Big loan',
			amount: -385,
			start: moment('2013-01-09'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Small loan',
			amount: -225,
			start: moment('2013-01-17'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Gym',
			amount: -90,
			start: moment('2013-04-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Haircut',
			amount: -17,
			start: moment('2013-02-20'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Betterment',
			amount: -810,
			start: moment('2013-07-08'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Salary',
			amount: 2369,
			start: moment('2013-01-01'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Salary',
			amount: 2369,
			start: moment('2013-01-15'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'Cash',
			amount: -70,
			start: moment('2013-01-05'),
			end: null,
			unit: 'weeks',
			every: 1
		}, {
			name: 'Other Amex',
			amount: -433,
			start: moment('2013-01-11'),
			end: null,
			unit: 'months',
			every: 1
		}, {
			name: 'NJ House',
			amount: -400,
			start: moment('2013-06-22'),
			end: moment('2013-06-23'),
			unit: 'months',
			every: 1
		}
	];


	return Backbone.Model.extend({
		defaults: {
			currentBalance: 4531,
			transactions: new Backbone.Collection(transactions)
		},

		initialize: function() {
			this.on('change:currentBalance', function() {
				var diff = this.get('currentBalance') - this._previousAttributes['currentBalance'];

				this._data.each(function(d) {
					d.set('balance', d.get('balance') + diff);
				});
				this.trigger('change:data');
			});
		},

		extrapolate: function(until) {
			var balance = this.get('currentBalance'),
				now = moment().startOf('day'),
				data = new (Backbone.Collection.extend({
					comparator: function(point) {
						return point.get('date').toDate().getTime();
					}
				}))(),
				date = now.clone();

			var last_point;
			while (date <= until) {
				total_amount = 0;

				this.get('transactions').each(function(t, i) {
					var start = t.get('start').startOf('day').clone(),
						end = t.get('end') ? t.get('end').startOf('day').clone() : null;

					// if date is in range of transaction
					while (start <= date  && (!end || date < end)) {
						if (start.isSame(date)) {
							total_amount += t.get('amount');
						}

						start = start.add(t.get('unit'), t.get('every'));
					}
				});

				var last_balance = last_point ? last_point.get('balance') : balance;
				last_point = new Backbone.Model({date: date.clone().startOf('day'), balance: last_balance + total_amount});
				data.add(last_point);

				date.add('days', 1);
			}

			this._data = data;
			return data;
		}
	});
});