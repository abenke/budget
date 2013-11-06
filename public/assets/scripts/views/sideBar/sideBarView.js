define(
[
"jquery",
"underscore",
"marionette",
"models/transaction",
"views/sideBar/transactionView",
"views/sideBar/addTransactionView"
],
function ($, _, Marionette, Transaction, TransactionView, AddTransactionView) {
	return Marionette.Layout.extend({

		template: 'sideBar/sideBar',
		className: 'side-bar',

		ui: {
			currentBalance: "input[name=currentBalance]",
			addTxnArea: ".add-transaction",
			addTxnRegion: ".add-transaction-region",
			addTxnButton: "button.add-txn",
			addButton: "button.add",
			closeButton: "button.close"
		},

		regions: {
			addTransactionRegion: '.add-transaction-region',
			transactionsRegion: '.transactions-region'
		},

		events: {
			"keyup input[name=currentBalance]": "onCurrentBalanceChange",
			"click button.add-txn": "showAddTransactionView",
			"click button.close": "hideAddTransactionView",
			"click button.add": "addTransaction"
		},

		initialize: function() {
		},

		onRender: function() {
			this.transactionsRegion.show(new Marionette.CollectionView({
				collection: this.model.get('transactions'),
				itemView: TransactionView,
				className: 'transactions'
			}));
		},

		showAddTransactionView: function(e) {
			// standard animation stuff
			if (this.animating) { return; }
			this.animating = true;

			// create new transaction and show the view with the form for the transaction
			this.transaction = new Transaction();
			this.addTransactionRegion.show(new AddTransactionView({
				model: this.transaction
			}));

			// animate in the form
			this.ui.addTxnButton.fadeOut();
			this.ui.addTxnArea.animate({height: '200px'}, function() {
				this.ui.addTxnArea.css('height', 'auto');
				this.ui.addTxnRegion.fadeIn();
				this.ui.addButton.fadeIn();
				this.ui.closeButton.fadeIn(function() {
					this.animating = false;
				}.bind(this));
			}.bind(this));
		},

		hideAddTransactionView: function() {
			// standard animation stuff
			if (this.animating) { return; }
			this.animating = true;


			// fade out form
			this.ui.addTxnRegion.fadeOut();
			this.ui.addButton.fadeOut();
			this.ui.closeButton.fadeOut();

			// close form and animate in button to reopen form
			this.ui.addTxnArea.css('height', this.ui.addTxnArea.height());
			this.ui.addTxnArea.animate({height: '30px'}, function() {
				this.addTransactionRegion.close();
				this.ui.addTxnButton.fadeIn(function() {
					this.animating = false;
				}.bind(this));
			}.bind(this));
		},

		onShow: function() {
			this.ui.currentBalance.val(this.model.get('currentBalance'));
		},

		onCurrentBalanceChange: function(e) {
			var self = this;
			clearTimeout(this.currentBalanceTimeout);
			this.currentBalanceTimeout = setTimeout(function() {
				self.model.set('currentBalance', parseInt($(e.currentTarget).val()) || 0);
				self.model.save({});
			}, 150);
		},

		addTransaction: function() {
			this.hideAddTransactionView();
			this.model.get('transactions').add(this.transaction);
			this.transaction = undefined;
			this.model.save({});
		}
	});
});