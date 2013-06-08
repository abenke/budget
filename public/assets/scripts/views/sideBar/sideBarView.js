define(
[
"jquery",
"underscore",
"marionette",
"views/sideBar/transactionView",
"views/sidebar/addTransactionView"
],
function ($, _, Marionette, TransactionView, AddTransactionView) {
	return Marionette.Layout.extend({
		
		template: 'sideBar/sideBar',
		className: 'side-bar',
		
		ui: {
			currentBalance: "input[name=currentBalance]",
			addTxnArea: ".add-transaction",
			addTxnRegion: ".add-transaction-region",
			addTxnButton: "button.add-txn",
			closeButton: "button.close"
		},

		regions: {
			addTransactionRegion: '.add-transaction-region',
			transactionsRegion: '.transactions-region'
		},

		events: {
			"keyup input[name=currentBalance]": "onCurrentBalanceChange",
			"click button.add-txn": "showAddTransactionView",
			"click button.close": "hideAddTransactionView"
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
			var self = this;

			if (this.animating) {
				return;
			}

			this.animating = true;

			var atView = new AddTransactionView();
			atView.on('add:transaction', function(txn) {
				this.hideAddTransactionView();
				this.model.get('transactions').add(txn);
			}, this);

			this.addTransactionRegion.show(atView);
			this.ui.addTxnButton.fadeOut();

			this.ui.addTxnArea.animate({height: '200px'}, function() {
				self.ui.addTxnArea.css('height', 'auto');
				self.ui.addTxnRegion.fadeIn();
				self.ui.closeButton.fadeIn(function() {
					self.animating = false;
				});
			});
		},

		hideAddTransactionView: function() {
			var self = this;

			if (this.animating) {
				return;
			}

			this.animating = true;


			this.ui.addTxnRegion.fadeOut();
			this.ui.closeButton.fadeOut();

			this.ui.addTxnArea.css('height', this.ui.addTxnArea.height());
			this.ui.addTxnArea.animate({height: '30px'}, function() {
				self.addTransactionRegion.close();
				self.ui.addTxnButton.fadeIn(function() {
					self.animating = false;
				});
			});
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