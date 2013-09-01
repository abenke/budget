define(
[
"jquery",
"d3"
],
function($) {
	var DURATION = 250;

	var Graph = function(options) {
		this.width = options.width;
		this.height = options.height;
		this.x_margin = options.x_margin;
		this.y_margin = options.y_margin;
		this.selector = options.selector;
		this.data = options.data;
		this.now = options.now;
		this.windowEnd = options.windowEnd;

		this._initGraph();
	}

	_.extend(Graph.prototype, {

		_initScales: function() {
			this.x = d3.scale.linear();
			this.y = d3.scale.linear();
			
			this._updateScalesRange();
			this._updateScalesDomain();

			this.line = d3.svg.line()
				.interpolate("step-after")
	    		.x(function(d,i) { return self.x(i); })
	    		.y(function(d,i) { return self.y(d); });
		},

		_initAxes : function() {
			self = this;

			this.xAxis = d3.svg.axis()
							.scale(this.x)
							.orient('bottom')
							.ticks(20)
							.tickSize(-1*(this.height - 2*this.x_margin), 0)
							.tickFormat(function(x) { return self.now.clone().add('days', x).format('M/D'); });

			this.yAxis = d3.svg.axis()
							.scale(this.y)
							.orient('right')
							.tickSize(-1*(this.width - this.y_margin - this.x_margin), 0)
							.tickFormat(function(y) { return '$' + y.toFixed(0); });

			this.chart.append('g')
				.attr("transform", "translate(0,"+(this.height-this.x_margin)+")")
				.attr("class", "axis x-axis")
				.call(this.xAxis);

			this.chart.append('g')
				.attr("transform", "translate("+(this.width-this.y_margin)+",0)")
				.attr("class", "axis y-axis")
				.call(this.yAxis);
		},

		_initHover: function() {
			var self = this,
				w = this.width, h = this.height,
				x = this.x_margin, y = this.y_margin;
        	this.chart.append('defs')
            	.append('clipPath')
                	.attr('id', 'innerGraph')
            	.append('path')
                	.attr('d', 'M '+x+' '+x+' L '+x+' '+(h-x)+' L '+(w-y)+' '+(h-x)+' L '+(w-y)+' '+x);

            this.chart.selectAll('g.hover-area')
            	.data([this.data])
	            .enter().append('g')
	            	.attr('class', 'hover-area')
	            	.attr("clip-path", "url(#innerGraph)")
	            	.attr('width', w-2*y)
	            	.attr('height', h-2*x);

	        this.bgArea = d3.svg.area()
	            .x(function(d, i) { return self.x(i); })
	            .y0(h-x)
	            .y1(x);

	        var hoverArea = this.chart.select('g.hover-area');

	        hoverArea.append('path')
	            .attr('class', 'bg')
	            .attr('style', 'stroke: none; fill: #ffffff;')
	            .attr('d', this.bgArea)
	            .attr("clip-path", "url(#innerGraph)");

	        this.vertical = hoverArea.append('path').attr('class', 'vertical');

            $('svg g.hover-area')
            .on('mousemove', function(e) {
                onMouseMove(e, self);
            })
            .on('mouseout', function(e) {
                onMouseOut(e, self);
            });
		},

		_initLine: function() {
			var self = this;

	    	this.chart.select('g.hover-area').append("path")
	    		.attr("class", "balance")
	    		.attr("d", this.line(this._subData()));
		},

		_initGraph: function() {
			this.chart = d3.select(this.selector)
			    .append("svg:svg")
			    .attr("width", this.width)
			    .attr("height", this.height);

			this._initScales();
			this._initHover();
			this._initAxes();
			this._initLine();
		},

		_updateScalesRange: function() {
			this.x.range([this.x_margin, this.width - this.y_margin]);
			this.y.range([this.x_margin, this.height - this.x_margin]);
		},

		_updateScalesDomain: function(data) {
			var subData = this._subData(data);
				minY = _.min(subData),
				maxY = _.max(subData);

			this.x.domain([0, this._maxIndex()]);
			this.y.domain([1.05*maxY, minY * (minY < 0 ? 1.1 : 0.9)]);
		},
		
		_maxIndex: function() {
			return Math.round(this.windowEnd.diff(this.now)/(1000*60*60*24));
		},

		_subData: function(data) {
			return (data || this.data).slice(0, this._maxIndex()+1);
		},

		_updateAxes: function() {
			this.xAxis && this.xAxis.scale(this.x);
			this.yAxis && this.yAxis.scale(this.y);
		},

		update: function(data) {
			var self = this;

			this.data = data || this.data;
			
			// Part 1
			/////////

			// update scales and axes
			this._updateScalesDomain(data); // use new data
			this._updateAxes();

			var path_update;

            // animate
            _.each({
            	"g.x-axis": function() { this.call(self.xAxis); }, 
            	"g.y-axis": function() { this.call(self.yAxis); },
            	"path.balance": (path_update = function() { this.attr('d', self.line(self._subData())); }) // use old data
            }, function(func, selector) {
            	func.apply(self.chart.selectAll(selector).transition().duration(DURATION).ease('in'));
            });

            // Part 2
            /////////

            // setTimeout(function() {
            // 	self.data = data || self.data;
            // 	path_update.apply(self.chart.select("path.balance").transition().duration(DURATION*2).ease('in'));
            // }, DURATION);
		}

	});

    // Firefox doesn't support offsetX and Y, have to use pageX and Y and offset manually
    function getMouseOffsets(e, graph) {
        return {
            x: !isNaN(e.offsetX) ? e.offsetX  : e.pageX - $(e.target).offset().left - 6,
            y: !isNaN(e.offsetY) ? e.offsetY - graph.x_margin  : e.pageY - $(e.target).offset().top - 6
        };
    }

	function onMouseMove(e, graph) {
        var offsets = getMouseOffsets(e, graph),
            mouseX = offsets.x,
            mouseY = offsets.y;

        // update position of vertical line
        d3.transition(graph.vertical)
            .attr('style', 'display: inline; stroke: #333333;')
            .attr('d', 'M'+mouseX + ',' + graph.height +
                       'L'+mouseX + ',' + 0);

        // // data to get y point for circles
        // var x = graph.x.invert(mouseX), // x in graph unit (ms)
        //     d = graph.graphData,
        //     minX = d[0].x, // min x val in d
        //     maxX = d[d.length-1].x, // max x val in d
        //     i = Math.round((C.points-1) * (x - minX) / (maxX - minX)); // transform from data unit (ms) to index of d

        // if (!d[i] || mouseY >= graph.height-5 || mouseY <= 0) {
        //     onMouseOut(e, graph);
        // } else {
        //     // hide current balance tooltip
        //     graph.hideCurrentBalanceTooltip = true;
        //     if (graph.$balanceTooltip) {
        //         graph.$balanceTooltip.hide();
        //     }

        //     // update avg and poor circles
        //     if (!graph.opts.hideAvgPoint) {
        //         d3.transition(graph.avgPoint)
        //             .style('display', 'inline')
        //             .attr('cx', mouseX)
        //             .attr('cy', graph.y(d[i].avg));
        //     }

        //     if (!graph.opts.hidePoorPoint) {
        //         d3.transition(graph.poorPoint)
        //             .style('display', 'inline')
        //             .attr('cx', mouseX)
        //             .attr('cy', graph.y(d[i].light0));
        //     }

        //     // update snapping circle
        //     if (graph.opts.showSnapPoint) {
        //         var dollarY = graph.y.invert(mouseY),
        //             closest;

        //         _.each(graph.snappers, function(snapper) {
        //             if (!closest || Math.abs(d[i][snapper.line] - dollarY) < Math.abs(d[i][closest.line] - dollarY)) {
        //                 closest = snapper;
        //             }
        //         });

        //         d3.transition(graph.snapPoint)
        //             .style('display', 'inline')
        //             .attr('cx', mouseX)
        //             .attr('cy', graph.y(d[i][closest.line]));
        //     }

        //     // update tooltip
        //     graph.$tooltip = $(graph.opts.selector).find('.hover-tooltip');
        //     offset = mouseX - graph.margin.left - graph.$tooltip.outerWidth();

        //     var leftMargin = graph.margin.left + parseInt($(graph.opts.selector).css('padding-left'));
        //     graph.$tooltip.css({
        //         display: 'block',
        //         left: ((mouseX + leftMargin) - (offset > 0 ? graph.$tooltip.outerWidth()+30 : -30)) + 'px'
        //     });

        //     graph.$tooltip.html(graph.opts.tooltipContents ? graph.opts.tooltipContents.call(graph, d, x, i, closest) : '');

        //     graph.trigger('change', d[i]);
        // }
    }

    function onMouseOut(e, graph) {
        var offsets = getMouseOffsets(e, graph),
            mouseX = offsets.x,
            mouseY = offsets.y;

        if (mouseX >= graph.width    || mouseX <= 0 ||
            mouseY >= graph.height-5 || mouseY <= 0) {

            hideToolTip(graph);
        }
    }

    function hideToolTip(graph) {
        d3.transition(graph.vertical)
            .style('display', 'none');

        // // hide tooltip TODO
        // if (graph.$tooltip) {
        //     graph.$tooltip.css({
        //         display: 'none'
        //     });
        // }
    }

	return Graph;
});