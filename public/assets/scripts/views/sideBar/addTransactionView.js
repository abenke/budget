define(
[
"jquery",
"underscore",
"marionette",
"views/sideBar/recurringView",
"views/sideBar/onceView"
],
function ($, _, Marionette, RecurringView, OnceView) {
	return Marionette.Layout.extend({
		template: 'sideBar/addTransaction',
		
		ui: {
			fqRegion: '.frequency-region',
			nameInput: '[name="name"]',
			amountInput: '[name="amount"]',
			typeGroup: '.type.btn-group',
			timeGroup: '.time.btn-group',
			onceButton: '.once.btn'
		},

		regions: {
			frequencyRegion: '.frequency-region'
		},

		events: {
			"click button.once": "showOnceView",
			"click button.recurring": "showRecurringView",

			'change input[name="name"]': 'changeName',
			'click .type.btn-group button': 'changeType',
			'change input[name="amount"]': 'changeAmount',
			'click .time.btn-group button': 'changeTime'
		},

		showOnceView: function(e) {
			if (this.showingOnce) return;
			this.showingOnce = true;
			this.showingRecurring = false;
			this._showFrequencyView(new OnceView({ model: this.model }));
		},

		showRecurringView: function(e) {
			if (this.showingRecurring) return;
			this.showingRecurring = true;
			this.showingOnce = false;
			this._showFrequencyView(new RecurringView({ model: this.model }));
		},

		_showFrequencyView: function(view) {
			var self = this;
			this.ui.fqRegion.slideUp(function() {
				self.frequencyRegion.show(view);
				self.ui.fqRegion.slideDown();
			});
		},

		changeName: function(e) {
			this.model.set('name', this.ui.nameInput.val());
		},

		changeType: function(e) {
			this.model.set('type', $(e.currentTarget).html().toLowerCase());
		},

		changeAmount: function(e) {
			this.model.set('amount', Math.abs(Math.round(parseFloat(this.ui.amountInput.val())) || 0));
		},

		changeTime: function(e) {
			this.model.set('oneTime', $(e.currentTarget).html() == 'Once');
		}
	});
});