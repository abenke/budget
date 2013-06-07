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
        _.extend(App, {});
    });

    App.addInitializer(function(options) {
        App.addRegions({
            sideBar: "section#sideBar",
            graphArea: "section#graphArea"
        });
    });

    // gets triggered when app starts
    App.on("start", function() {
        App.graphInfo = new GraphInfo();

        App.sideBar.show(new SideBarView({ model: App.graphInfo }));
        App.graphArea.show(new GraphView({ model: App.graphInfo }));
    });

    return App;
});