define(
[
"jquery",
"underscore",
"marionette",
"common/graph",
"models/transaction"
],
function ($, _, Marionette, Graph, Transaction) {
	var X_MARGIN = 40,
		Y_MARGIN = 80;

	return Marionette.ItemView.extend({
		template: 'graph/graph',
		tagName: "div",
		className: "graph",
		
		events: {
		},

		initialize: function() {
			this.listenTo(this.model, "change:data", this.updateGraph);
		},

		onShow: function() {
			this.graph = new Graph({
				now: this.model.get('start'),
				width: this.$el.width(),
				height: this.$el.height(),
				x_margin: X_MARGIN,
				y_margin: Y_MARGIN,
				selector: '.svg-area',
				data: this.model.getData(),
				windowEnd: this.model.get('end')
			});
		},

		updateGraph: function() {
			this.graph.update(this.model.getData());
		}
	});
});