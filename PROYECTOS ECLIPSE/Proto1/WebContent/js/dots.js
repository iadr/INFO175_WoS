

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
		.attr("height", svg_h);
	svg_array.push(an_svg);
}


//escalas de fecha y nivel

var date_scale = d3.scaleTime()
	.domain([new Date(2016, 1, 1), new Date(2016, 8, 1)])
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
		//random date setup	
		//will this glitch cuz of months with less than 31 days?
	    var la_fecha = new Date(2016, Math.round(Math.random() * 8), Math.round(Math.random() * 31), Math.round(Math.random() * 23), Math.round(Math.random() * 60), Math.round(Math.random() * 60));
	    var newLevel = Math.round(Math.random() * 30);
	    var pretest = "hi";
	    if (Math.random() < .5) {
	    	pretest = "lo";
	    }
	    var studentID = "s1";
	    if (Math.random() < .5) {
	    	studentID = "s2";
	    }
	    dataset.push([la_fecha, newLevel, pretest, studentID]);	    
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
    		})
		
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


//janky zoom/pan

// creates the zoom handler
var zoom_handler = d3.zoom()
	.on("zoom", do_the_zoom);

//	what happens when zoom is triggered
function do_the_zoom() {
	  d3.selectAll("circle").attr("transform", d3.event.transform);
	  //d3.selectAll("g").attr("transform", d3.event.transform);      //fix this eventually
	}

// tells the zoom handler where to listen
for (var q = 0; q < 3; q++) {
	zoom_handler(svg_array[q]);
}
