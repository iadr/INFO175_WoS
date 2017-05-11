

// global variables
var svg_w = 800;
var svg_h = 150;
var padding = 10;

var dot_opacity = .4;


// hacer SVG elementos
var svg1 = d3.select("body")
	.select("#interface")
	.append("svg")
	.attr("width", svg_w)
	.attr("height", svg_h);
var svg2 = d3.select("body")
	.select("#interface")
	.append("svg")
	.attr("width", svg_w)
	.attr("height", svg_h);
var svg3 = d3.select("body")
	.select("#interface")
	.append("svg")
	.attr("width", svg_w)
	.attr("height", svg_h);

var svg_array = [svg1, svg2, svg3]


//escalas de fecha y nivel
var date_scale = d3.scaleLinear()
	.domain([0, 1000]) //domain de fechas
	.range([padding, svg_w - padding]);

var nivel_scale = d3.scaleLinear()
	.domain([0, 30])	//domain de nivel
	.range([svg_h - padding, padding]); //invertido
	
var date_axis = d3.axisBottom(date_scale);


// the big loop that makes everything
for (var q = 0; q < 3; q++) {
	var svg = svg_array[q];
	
	// dataset aleatorio
	var dataset = [];
	for (var i = 0; i < 500; i++) {           				
	    var newDate = Math.round(Math.random() * 1000);		
	    var newLevel = Math.round(Math.random() * 30);
	    var pretest = "hi";
	    if (Math.random() < .5) {
	    	pretest = "lo";
	    }
	    var studentID = "s1";
	    if (Math.random() < .5) {
	    	studentID = "s2";
	    }
	    dataset.push([newDate, newLevel, pretest, studentID]);	    
	}
	
	// hacer los puntos(circulos)
	var points = svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("r", 2) 					//encogelo eventualmente
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
		.attr("transform", "translate(0," + (svg_h - padding) + ")")
		.call(date_axis)
		.select("path")
		.attr("opacity", "0");	//inelegante

}


// event handling
d3.selectAll("svg").selectAll("circle")

	.on("mouseover", function(d) {
		var parent_svg = d3.select(this.parentNode);

		parent_svg.selectAll("circle")
			.transition()
    		.attr("fill-opacity", function(d2) {
    			if (d[3] != d2[3]) {
    				return dot_opacity*.4;
    			}
    			else {return dot_opacity};
    		});
		
		parent_svg.selectAll("." + d[3])
			.transition()
      		.attr("r", 2.5)
      		.attr("fill-opacity", .9);
		
	})		
	
	.on("mouseout", function(d) {
		d3.selectAll("circle")
			.transition()
			.delay(100)
	      	.attr("r", 2)
	    	.attr("fill-opacity", dot_opacity);
	});

var zoom = d3.zoom()
	.scaleExtent([1, 10])
	.on("zoom", zoomed);

function zoomed() {
	  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}
	
