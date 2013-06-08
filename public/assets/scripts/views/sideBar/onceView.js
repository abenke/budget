define(
[
"jquery",
"underscore",
"marionette"
],
function ($, _, Marionette) {
	return Marionette.Layout.extend({
		
		ui: {
		},

		regions: {
		},

		events: {
		},

		initialize: function() {
		},

		onRender: function() {
			var self = this;

			this.$el.datepicker().on('changeDate', function(e) {
				self.trigger('change:date', e.date);
			});

			this.trigger('change:date', this.$el.datepicker('getDate'));
		},

		onShow: function() {
		}
	});
});