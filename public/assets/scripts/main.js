require.config({
	paths: {
		jquery: "libs/jquery",
		bootstrap: "libs/bootstrap",
		'bootstrap.datepicker': "libs/bootstrap.datepicker",
		underscore: "libs/underscore",
		moment: "libs/moment",
		backbone: "libs/backbone",
		marionette: "libs/marionette",
		d3: "libs/d3",
		'backbone.babysitter': "libs/backbone.babysitter",
		'backbone.wreqr': "libs/backbone.wreqr"
	}
});

require(
[
"jquery",
"app",
"bootstrap",
"bootstrap.datepicker",
"common/overrides"
],
function($, App) {

	$(function() {
		App.start();
	});

});