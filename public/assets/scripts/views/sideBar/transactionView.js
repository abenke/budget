define(
[
"jquery",
"underscore",
"marionette"
],
function ($, _, Marionette) {
	return Marionette.ItemView.extend({
		
		template: 'sideBar/transaction',
		
		className: 'transaction',

		templateHelpers: {
			frequency: function() {
				var s,
					start = this.start.format('MMM. Do');

				if (this.oneTime) {
					s = 'one time on '+start;
				} else {
					s = 'every ';

					var one = this.every == 1;
					if (!one) {
						s += this.every + ' ';
					}

					if (this.unit == 'weeks') {
						s += this.start.format('dddd').toLowerCase() + (one ? '' : 's');
					} else {
						s += this.unit.substr(0, this.unit.length - (one ? 1 : 0));
					}

					if (this.start > moment()) {
						s += ' (starting '+start+')';
					}
				}

				return s;
			},

			money: function(val) {
				var s = '';
				if (val < 0) {
					s += '-'
				}

				s += '$';

				var numString = Math.round(Math.abs(val)).toFixed(0);

				var commas = '';
				for (var i = 0; i < numString.length; i++) {
					commas = ((i+1)%3==0 && i!=numString.length-1 ? ',' : '') + numString[numString.length-i-1] + commas;
				}

				return s + commas;
			}
		},

		ui: {
			amountArea: '.amount-area',
			amountInput: 'input[name="amount"]',
			amountLabel: '.amount-label',
			pencil: 'i.icon-pencil',
			okSign: 'i.icon-ok'
		},

		events: {
			"click button.edit": "editAmount",
			'change input[name="amount"]': 'changeAmount'
		},

		initialize: function() {
			this.templateHelpers.self = this;
		},

		editAmount: function(e) {
			var actions = [
				this.editing ? 'show' : 'hide',
				this.editing ? 'hide' : 'show'
			];

			this.ui.pencil.css('display', this.editing ? 'inline-block' : 'none');
			this.ui.okSign.css('display', this.editing ? 'none' : 'inline-block');
			this.ui.amountLabel[actions[0]]().html(this.templateHelpers.money(this.model.signedAmount()));
			this.ui.amountInput[actions[1]]().val(this.model.get('amount'));

			this.editing = !this.editing;
		},

		changeAmount: function(e) {
			this.model.set('amount', Math.abs(parseFloat(this.ui.amountInput.val()) || 0));
		}
	});
});