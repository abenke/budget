define(
[
"jquery",
"underscore",
"marionette",
"common/graph"
],
function ($, _, Marionette, Graph) {
	var X_MARGIN = 40,
		Y_MARGIN = 80,
		HORIZON_HEIGHT = 60;

	return Marionette.ItemView.extend({
		template: 'graph/graph',
		tagName: "div",
		className: "graph",
		
		events: {
		},

		initialize: function() {
			this.windowEnd = moment().add('weeks', 60);
			this.listenTo(this.model, "change:data", this.updateGraph);
		},

		onShow: function() {
			var now = moment(),
				start = this.windowEnd.clone(),
				end = now.clone().add('months', 14);

			this.graph = new Graph({
				now: now,
				width: this.$el.width(),
				height: this.$el.height() - HORIZON_HEIGHT,
				x_margin: X_MARGIN,
				y_margin: Y_MARGIN,
				selector: '.svg-area',
				data: this.model.extrapolate(end).pluck('balance'),
				windowEnd: this.windowEnd
			});
		},

		updateGraph: function() {
			this.graph.update(this.model._data.pluck('balance'));
		}
	});
});