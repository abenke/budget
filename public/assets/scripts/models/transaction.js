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
			var cur = windowStart.clone(),
				dates = [];

			while (cur >= windowStart && cur <= windowEnd) {
				if (this.matches(cur)) {
					dates.push(cur.clone());
				}
				cur = cur.add('days', 1);
			}

			return dates;
		},

		isOneTime: function() {
			return this.get('unit') == 'one_time';
		},

		matches: function(date) {
			return this._match(date, this.get('unit'));
		},

		_match: function(date, unit) {
			var specs = this.get('specifics').length ? this.get('specifics') : [moment()];

			return _.reduce(specs, function(any_match, spec) {
				return any_match || this['_match_'+unit](date, spec, this._diff(unit, date));
			}, false, this);
		},

		_match_one_time: function(date, spec, diff) {
			return date.isSame(moment(spec))
		},

		_match_years: function(date, spec, diff) {
			return date.isSame(moment(spec)) && this._matches_frequency(diff, this.get('frequency'));
		},

		_match_months: function(date, spec, diff) {
			return date.date() == spec && this._matches_frequency(diff, this.get('frequency'));
		},

		_match_weeks: function(date, spec, diff) {
			return date.day() == spec && this._matches_frequency(diff, this.get('frequency'));
		},

		_match_days: function(date, spec, diff) {
			return this._matches_frequency(diff, this.get('frequency'));
		},

		_matches_frequency: function(diff, freq) {
			return diff % freq === 0;
		},

		_diff: function(unit, date) {
			return date.diff(moment().startOf('day'), unit);
		}
	});
});