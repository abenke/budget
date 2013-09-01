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

		signedAmount: function(amount) {
			var sign = this.get('type') == 'expense' ? -1 : 1;
			return sign * (amount === 0 ? 0 : (amount || this.get('amount'))); 
		},

		toJSON: function() {
			var attribues = Backbone.Model.prototype.toJSON.call(this);
			delete attribues._id;
			return attribues;
		},

		dates: function(windowStart, windowEnd) {
			var start = this.get('start'),
				end = this.get('end') || windowEnd,
				cur = start.clone(),
				dates = [];

			while (cur >= start && cur < end) {
				if (cur >= windowStart) {
					dates.push(cur.clone());
				}
				cur = cur.add(this.get('unit'), this.get('every'));
			}

			return dates;
		}
	});
});