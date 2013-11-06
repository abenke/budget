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
			this.model.set('unit', 'one_time');

            this.$el.datepicker().on('changeDate', function(e) {
				this.model.set('specifics', [moment(e.date).format('YYYY-MM-DD')]);
			}.bind(this));
		}
	});
});