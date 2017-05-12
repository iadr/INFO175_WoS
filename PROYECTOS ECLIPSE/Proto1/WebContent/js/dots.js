

// global variables
var svg_w = 800;
var svg_h = 150;
var padding = 10;

var dot_opacity = .4;


// hacer SVG elementos

var svg_array = []

for (var q = 0; q < 3; q++) {
	var an_svg = d3.select("body")
		.select("#interface")
		.append("svg")
		.attr("width", svg_w)
		.attr("height", svg_h)
		.attr("id", q);
	svg_array.push(an_svg);
}

//escalas de fecha y nivel

var date_scale = d3.scaleTime()
	.domain([new Date(2016, 2, 1), new Date(2016, 7, 1)]) //build this off of actual dates perhaps?
    .range([padding, svg_w - padding]);

var nivel_scale = d3.scaleLinear()
	.domain([0, 30])	//domain de nivel
	.range([svg_h - padding, padding]); //invertido
	
var date_axis = d3.axisBottom(date_scale);


// the big loop that makes everything
for (var q = 0; q < 3; q++) {
	var svg = svg_array[q];
	
	//input ejemplos
	//2016-12-01 15:19:10.0
	//2016-11-30 14:38:21.0
	
	// dataset aleatorio
	var dataset = [];
	for (var i = 0; i < 1000; i++) {           				
		//random date setup	- will this glitch cuz of months with less than 31 days?
	    var la_fecha = new Date(2016, Math.round(Math.random() * 4) + 2, Math.round(Math.random() * 31), Math.round(Math.random() * 23), Math.round(Math.random() * 60), Math.round(Math.random() * 60));
	    var newLevel = Math.round(Math.random() * 30);
	    var pretest = "hi";
	    if (Math.random() < .5) {
	    	pretest = "lo";
	    }
	    var student_array = ["s0","s1","s2","s3","s4","s5","s6","s7","s8","s9","s10"]
	    var studentID = student_array[Math.round(Math.random() * 9)];
	    dataset.push([la_fecha, newLevel, pretest, studentID]);	    
	}
	
	// hacer los puntos(circulos)
	var points = svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("r", 2) 
		.attr("cx", function(d) {
			return date_scale(d[0]);
		})
		.attr("cy", function(d) {
			return nivel_scale(d[1]);
		})
		.attr("fill", function(d) {
			if (d[2] == "hi") {
				return "red";
			}
			else {
				return "blue";
			}
		})
		.attr("class", function(d) {
			return d[3];
		})
		.attr("fill-opacity", dot_opacity)
		
	// draws the axes
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (svg_h - padding) + ")")
		.call(date_axis);
		//.select("path")
		//.attr("opacity", "0");	//inelegante

}


// event handling -- the mouse
d3.selectAll("svg").selectAll("circle")

	.on("mouseover", function(d) {
		var parent_svg = d3.select(this.parentNode);
		
		// other students fade
		parent_svg.selectAll("circle")
			.transition()
    		.attr("fill-opacity", function(d2) {
    			if (d[3] != d2[3]) {
    				return dot_opacity*.4;
    			}
    			else {return dot_opacity};
    		})
		
    	// current student destacado
		parent_svg.selectAll("." + d[3])
			.transition()
      		.attr("r", 2.5)
      		.attr("fill-opacity", .9);
		
	})		
	
	// return everyone to normal
	.on("mouseout", function(d) {
		d3.selectAll("circle")
			.transition()
			.delay(100)
	      	.attr("r", 2)
	    	.attr("fill-opacity", dot_opacity);
	});


// ZOOMIN'

// creates the zoom handler
var zoom_handler = d3.zoom()
	.on("zoom", do_the_zoom)
	.scaleExtent([1,100])
	.translateExtent([[0, 0], [svg_w, svg_h]]);

//where to listen for zooming
var los_tres_svgs = d3.select("#interface").selectAll("svg");
los_tres_svgs.call(zoom_handler);

//	what happens when zoom is triggered
function do_the_zoom() {
	var current_svg = d3.select(this);
	
	// transforms all the circles
	d3.selectAll("circle")
		.attr("transform", d3.event.transform);
		//.attr("r", 3/zoom_handler.scale);
	
	// selects the two other svgs
	var other_svgs = los_tres_svgs.filter( function() {
		return d3.select(this).attr("id") !== current_svg.attr("id");
	});
	
	// breaks a loop of sorts - https://groups.google.com/forum/#!topic/d3-js/_36l7uHNYsQ
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return; }
	zoom_handler.transform(other_svgs, d3.event.transform);
	
	
	// dealing with the axes
	d3.selectAll(".axis").call(date_axis.scale(d3.event.transform.rescaleX(date_scale)));
}



