define(
[
"jquery",
"underscore",
"backbone",
"marionette",
"models/graphInfo",
"views/graphView",
"views/sideBar/sideBarView"
],

function ($, _, Backbone, Marionette, GraphInfo, GraphView, SideBarView) {

    App = new Marionette.Application();

    App.addInitializer(function(options) {
        _.extend(App, {
            // add methods to App object here
        });
    });

    App.addInitializer(function(options) {
        // create application level regions for sidebar and graph
        App.addRegions({
            sideBar: "section#sideBar",
            graphArea: "section#graphArea"
        });
    });

    // gets triggered when app starts
    App.on("start", function() {
        var now = moment().startOf('day');

        // create a graphInfo model and hang it off of App object
        App.graphInfo = new GraphInfo({
            start: now,
            end: now.clone().add('months', 12)
        });

        // download the budget from the server
        App.graphInfo.fetch({
            complete: function() {
                // show the views in their respective regions with the data we just downloaded
                App.sideBar.show(new SideBarView({ model: App.graphInfo }));
                App.graphArea.show(new GraphView({ model: App.graphInfo }));
            }
        });
    });

    return App;
});