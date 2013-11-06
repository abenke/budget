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
		className: 'add-transaction'
	});
});