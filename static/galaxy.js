function ready(){
	ajax_to_draw();
}

function draw_galaxy(data){
	var name_coord = data[0];
	var names = $.map(name_coord, function(nc){return nc[0];});
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

	var zoom = d3.behavior.zoom().scaleExtent([1, 80])
	var zf = d3.scale.linear()
    .domain([10, 0.1])
    .range([20, 80]);

  function move(){
    var t = d3.event.translate,
        s = d3.event.scale;
    svg.attr('transform', 'translate(' + t + ')scale(' + s + ')');
  }

	var svg = d3.select('body')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.call(zoom.on("zoom", move)) 
		.append('g');

	var tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style('background', 'white');

	var beer_enter = svg.selectAll('circle')
		.data(name_coord)
		.enter().append('g');

	beer_enter.append('circle')
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
		})
		.on("click", function(d){
      var zoom_factor = zf($(this).attr('r'));
      if(zoom_factor == zoom.scale()){
        zoom_factor /= 5;
      }
      var translate = (-parseInt($(this).attr('cx')) * zoom_factor + width/2) + ',' + (-parseInt($(this).attr('cy')) * zoom_factor + height/2);
      var scale = zoom_factor;
      zoom.translate(eval('[' + translate + ']'));
      zoom.scale(scale);
      svg.transition()
        .attr('transform', 'translate(' + translate + ')scale(' + scale + ')');
		  console.log(d[2]);
		});


	$('#search').autocomplete({
		source: names,
		minLength: 3,
		select: function(event, ui){
			svg.selectAll('circle[name="' + ui.item.value + '"]')
				.transition()
				.attr('stroke', 'black')
				.attr('stroke-width', '0.1px');
      var zoom_factor = zf(svg.select('circle[name="' + ui.item.value + '"]').attr('r'));
			var translate = (-parseInt(svg.select('circle[name="' + ui.item.value + '"]').attr('cx')) * zoom_factor + width/2) + ',' + (-parseInt(svg.select('circle[name="' + ui.item.value + '"]').attr('cy')) * zoom_factor + height/2);
			var scale = zoom_factor;
			zoom.translate(eval('[' + translate + ']'));
			zoom.scale(scale);
			svg.transition()
				.attr('transform', 'translate(' + translate + ')scale(' + scale + ')');
		}
	});
}

function ajax_to_draw(){
	var overlay = $("<div class='overlay'> </div>");
	var spinner = $("<div class='spinner'> </div>");
	overlay.appendTo($("body"));
	spinner.appendTo($("body"));

	$.ajax({
		url: '/api/full_json',
		success: function(data){
			draw_galaxy(data);
		},
		complete: function(){
			overlay.remove();
			spinner.remove();
		}
	})
}
