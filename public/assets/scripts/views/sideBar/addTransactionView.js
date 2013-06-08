define(
[
"jquery",
"underscore",
"marionette",
"models/transaction",
"views/sideBar/recurringView",
"views/sideBar/onceView"
],
function ($, _, Marionette, Transaction, RecurringView, OnceView) {
	return Marionette.Layout.extend({
		template: 'sideBar/addTransaction',
		
		ui: {
			fqRegion: '.frequency-region',
			nameInput: '[name="name"]',
			amountInput: '[name="amount"]',
			typeGroup: '.type.btn-group',
			onceButton: '.once.btn',
			addButton: 'button.add'
		},

		regions: {
			frequencyRegion: '.frequency-region'
		},

		events: {
			"click button.once": "showOnceView",
			"click button.recurring": "showRecurringView",
			"click button.add": "addTransaction"
		},

		initialize: function() {
			this.model = new Transaction();
		},

		onRender: function() {
		},

		onShow: function() {
		},

		showOnceView: function(e) {
			if (this.showingOnce) return;
			this.showingOnce = true;
			this.showingRecurring = false;

			var view = new OnceView();
			view.on('change:date', function(date) {
				this.date = date;
			}, this);
			this._showFrequencyView(view);
		},

		showRecurringView: function(e) {
			if (this.showingRecurring) return;
			this.showingRecurring = true;
			this.showingOnce = false;
			this._showFrequencyView(new RecurringView());
		},

		_showFrequencyView: function(view) {
			var self = this;
			this.ui.fqRegion.slideUp(function() {
				self.frequencyRegion.show(view);
				self.ui.fqRegion.slideDown();
			});
		},

		addTransaction: function() {
			this.ui.addButton.button('loading');

			var type = this.ui.typeGroup.find('.active.btn').html(),
				neg = type.toLowerCase() == 'expense',
				amount = (neg ? -1 : 1) * Math.abs(parseFloat(this.ui.amountInput.val()) || 0);

			this.model.set({
				name: this.ui.nameInput.val(),
				amount: amount,
				oneTime: this.ui.onceButton.is('.active'),
				start: moment(this.date)
			});

			this.trigger('add:transaction', this.model);
		}
	});
});