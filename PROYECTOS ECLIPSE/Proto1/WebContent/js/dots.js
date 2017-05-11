
// global variables
var svg_w = 800;
var svg_h = 100;
var padding = 20;

var dot_opacity = .4;

// hacer el bucle de todas las figuras (quizpet, parsons, etc.)
for (j = 0; j < 4; j++) {
	
	//datos aleatorios para probar
	//	formato_ej: [fecha(0-100), nivel(0-9), alto/bajo(hi/lo) pretest]
	var dataset = [];
	for (var i = 0; i < 200; i++) {           				
	    var newDate = Math.round(Math.random() * 100);		
	    var newLevel = Math.round(Math.random() * 9);
	    var pretest = "hi";
	    if (Math.random() < .5) {
	    	pretest = "lo";
	    }
	    dataset.push([newDate, newLevel, pretest]);	
	    
	}
	
	// hacer SVG element
		var svg = d3.select("body")
					.select("#interface")
					.append("p")
					.append("svg")
					.attr("width", svg_w)
					.attr("height", svg_h);
	
	//escalas de fecha y nivel
	var date_scale = d3.scaleLinear()
		.domain([0, 100]) //domain de fechas
		.range([padding, svg_w - padding]);
	
	var nivel_scale = d3.scaleLinear()
		.domain([0, 9])	//domain de nivel
		.range([svg_h - padding, padding]); //invertido
		
	var date_axis = d3.axisBottom(date_scale);
	
	// hacer los puntos(circulos)
	var points = svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("r", 3) 					//encogelo eventualmente
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
		.attr("fill-opacity", .4); 		//bajalo eventualmente
		
	svg.append("g")
		.attr("transform", "translate(0," + (svg_h - padding) + ")")
    	.call(date_axis)
    	.select("path")
    	.attr("opacity", "0");	//inelegante
	
}
