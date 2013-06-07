define(
[
"jquery",
"underscore",
"marionette",
"views/sideBar/transactionView"
],
function ($, _, Marionette, TransactionView) {
	return Marionette.CompositeView.extend({
		
		template: 'sideBar/sideBar',
		
		className: 'side-bar',

		itemViewContainer: '.transactions',
		itemView: TransactionView,
		
		ui: {
			currentBalance: "input[name=currentBalance]"
		},

		events: {
			"keyup input[name=currentBalance]": "onCurrentBalanceChange"
		},

		initialize: function() {
			this.collection = this.model.get('transactions');
		},

		onShow: function() {
			this.ui.currentBalance.val(this.model.get('currentBalance'));
		},

		onCurrentBalanceChange: function(e) {
			var self = this;
			clearTimeout(this.currentBalanceTimeout);
			this.currentBalanceTimeout = setTimeout(function() {
				self.model.set('currentBalance', parseInt($(e.currentTarget).val()) || 0);
			}, 150);
		}
	});
});