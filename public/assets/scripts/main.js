require.config({
	shim: {
		'jquery.ui': ['jquery']
    },
	paths: {
		jquery: "libs/jquery",
		'jquery.ui': "libs/jquery.ui",
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
"jquery.ui",
"common/overrides"
],
function($, App) {

	$(function() {
		App.start();
	});

});