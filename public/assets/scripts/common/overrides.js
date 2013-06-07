define(
[
"jquery",
"underscore",
"marionette"
],
function($, _, Marionette) {
	Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
        var html = '';
        
        if (templateId) {
            $.ajax({
                url: "assets/templates/" + templateId + ".html",
                async: false,
                success: function(templateHtml) {
                    html = templateHtml;
                }
            });
        }
        
        return html;
	};
});