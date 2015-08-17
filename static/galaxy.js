function ready(){
	draw_galaxy();
}

function draw_galaxy(){
  var overlay = $("<div class='overlay'> </div>");
  var spinner = $("<div class='spinner'> </div>");
  overlay.appendTo($("body"));
  spinner.appendTo($("body"));

	$.ajax({
		url: '/api/full_json',
		success: function(data){
			var name_coord = data[0];
			var x_extent = data[1];
			var y_extent = data[2];
			var styles = data[3];
			var rn_extext = data[4];

			var color = d3.scale.ordinal()
				.domain(styles)
				.range(d3.scale.category20().range());

			var width = document.documentElement.clientWidth;
			var height = document.documentElement.clientHeight;

			var x = d3.scale.linear()
				.domain(x_extent)
				.range([0, width])
			var y = d3.scale.linear()
				.domain(y_extent)
				.range([0, height])
			var rn = d3.scale.linear()
				.domain(rn_extext)
				.range([0.1, 10])
			var opa = d3.scale.linear()
				.domain(rn_extext)
				.range([1, 0.1])

			var svg = d3.select('body')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.call(d3.behavior.zoom().on("zoom", function(){
					svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
				}))
				.append('g');

			var tooltip = d3.select("body")
    			.append("div")
    			.style("position", "absolute")
    			.style("z-index", "10")
    			.style("visibility", "hidden")
    			.style('background', 'white');

			svg.selectAll('circle')
				.data(name_coord)
				.enter()
				.append('circle')
				.attr('name', function(d){
					return d[0];
				})
				.attr('cx', function(d){
					return x(d[1][0]);
				})
				.attr('cy', function(d){
					return y(d[1][1]);
				})
				.attr('r', function(d){
					return rn(d[3]);
				})
				.style('fill', function(d){
					return color(d[2]);
				})
				.style('opacity', function(d){
					return opa(d[3]);
				})
				.on("mouseover", function(){
					d3.select(this).style('fill', 'cyan');
					return tooltip.style("visibility", "visible");
				})
				.on("mousemove", function(d){
					return tooltip.style("top",	(d3.event.pageY-10)+"px")
						.style("left",(d3.event.pageX+10)+"px")
						.text(d[0]);
				})
				.on("mouseout", function(d){
					d3.select(this).style('fill', function(d){
						return color(d[2]);
					});
					return tooltip.style("visibility", "hidden");
				});
		},

    complete: function() {
      overlay.remove();
      spinner.remove();
    }
	})
}
