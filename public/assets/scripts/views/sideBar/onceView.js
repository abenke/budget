define(
[
"jquery",
"underscore",
"marionette",
"moment",
],
function ($, _, Marionette, moment) {
	return Marionette.Layout.extend({

		onRender: function() {
			var self = this;
			this.$el.datepicker().on('changeDate', function(e) {
				self.model.set('start', moment(e.date));
			});
		}
	});
});