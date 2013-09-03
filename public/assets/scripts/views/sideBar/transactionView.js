define(
[
"jquery",
"underscore",
"marionette"
],
function ($, _, Marionette) {
	var onces = ['Once', 'Twice', 'Three times', 'Four times', 'Five times'];

	return Marionette.ItemView.extend({
		
		template: 'sideBar/transaction',
		
		className: 'transaction',

		templateHelpers: {
			frequency: function() {
				var s = '',
					one = this.self.model.get('frequency') == 1,
					unit = this.unit.substr(0, this.unit.length - (one ? 1 : 0));
					specs = this.specifics;
				
				if (specs && specs.length > 1) {
					s += onces[specs.length-1] + ' a ';
				} else {
					s += 'Every '+(one ? '' : this.self.model.get('frequency'))+' ';
				}

				s += unit;

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
			'keyup input[name="amount"]': 'changeAmount'
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