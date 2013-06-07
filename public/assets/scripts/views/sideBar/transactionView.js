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
		},

		events: {
		},

		initialize: function() {
		},

		onShow: function() {
		}
	});
});