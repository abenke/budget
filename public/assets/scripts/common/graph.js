define(
[
"d3"
],
function() {
	var DURATION = 125;

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
		},

		_initAxes : function() {
			self = this;

			this.chart.selectAll("line.y")
				.data(this.y.ticks(10))
				.enter().append("line")
				.attr("class", "y")
				.attr("x1", this.x.range()[0])
				.attr("x2", this.x.range()[1])
				.attr("y1", this.y)
				.attr("y2", this.y);

			this.chart.selectAll("line.x")
				.data(this.x.ticks(25))
				.enter().append("line")
				.attr("class", "x")
				.attr("x1", this.x)
				.attr("x2", this.x)
				.attr("y1", this.y.range()[0])
				.attr("y2", this.y.range()[1]);

			this.xAxis = d3.svg.axis()
							.scale(this.x)
							.ticks(25)
							.orient('bottom')
							.tickFormat(function(x) { return self.now.clone().add('days', x).format('M/D'); });

			this.yAxis = d3.svg.axis()
							.scale(this.y)
							.orient('right')
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

		_initLine: function() {
			var self = this;
			this.line = d3.svg.line()
				.interpolate("step-after")
	    		.x(function(d,i) { return self.x(i); })
	    		.y(function(d,i) { return console.log(d.get('balance')); self.y(d.get('balance')); });

	    	this.chart.append("path")
	    		.attr("class", "balance")
	    		.attr("d", this.line(this._subData()));
		},

		_initGraph: function() {
			this.chart = d3.select(this.selector)
			    .append("svg:svg")
			    .attr("width", this.width)
			    .attr("height", this.height);

			this._initScales();
			this._initAxes();
			this._initLine();
		},

		_updateScalesRange: function() {
			this.x.range([this.x_margin, this.width - this.y_margin]);
			this.y.range([this.x_margin, this.height - this.x_margin]);
		},

		_updateScalesDomain: function(data) {
			var subData = this._subData(data);

			yGetter = function(p) { return p.get('balance'); },
				minY = _.min(subData, yGetter).get('balance'),
				maxY = _.max(subData, yGetter).get('balance');

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
            	func.apply(self.chart.select(selector).transition().duration(DURATION).ease('in'));
            });

            // Part 2
            /////////

            setTimeout(function() {
            	self.data = data || self.data;
            	path_update.apply(self.chart.select("path.balance").transition().duration(DURATION*2).ease('in'));
            }, DURATION);
		}

	});

	return Graph;
});