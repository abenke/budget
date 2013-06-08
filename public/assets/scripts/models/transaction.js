define(
[
"underscore",
"moment",
"backbone"
],
function(_, moment, Backbone) {
	return Backbone.Model.extend({

		initialize: function() {
		},

		signedAmount: function() {
			var sign = this.get('type') == 'expense' ? -1 : 1;
			return sign * this.get('amount'); 
		}
	});
});