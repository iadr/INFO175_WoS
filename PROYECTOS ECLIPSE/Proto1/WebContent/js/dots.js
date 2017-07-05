
var ig=0;
var datar=[]

function lee_json() {
    $.getJSON("data.json",function(data){

//data tiene los elementos de data.json
//ejemplo de acceso a data
//data[0].usuario ->return noname160005
    	
// variables globales
var svg_w = 850;
var svg_h = 150;
var padding = 10;

var dot_opacity = .4;
var dot_radius = 2;
var d_box_opacity = .7;

var scale_factor = 1;


// hacer SVG elementos
d3.select("body")
	.select("#interface")
	.append("svg")
	.attr("width", svg_w)
	.attr("height", 20);

var svg_array = []
for (var q = 0; q < 3; q++) {
	var an_svg = d3.select("body")
		.select("#interface")
		.append("svg")
		.attr("width", svg_w)
		.attr("height", svg_h)
		.attr("class", "graphs")
		.attr("id", q);
	svg_array.push(an_svg);
}

// maybe make 3 separate svgs?

//legend
function drawLegend(dot_op) {
	var legend = d3.select("#interface")
		.append("div")
		.attr("id", "legend");
	
	var leg1 = legend.append("div").append("svg")
		.attr("id", "leg1")
		.attr("class", "legend_components")
		.attr("width", 600)
		.attr("height", 12);
	
	leg1.append("circle")
		.attr("r", 5)
		.attr("cx", 10)
		.attr("cy", 5)
		.attr("opacity", dot_op)
		.attr("fill", "blue");
	
	leg1.append("text")
		.attr("x", 20)
		.attr("y", 8)
		.text("cada circulo representa una sesión de un alumno");
	
	leg1.append("circle")
		.attr("r", 3)
		.attr("cx", 325)
		.attr("cy", 5)
		.attr("opacity", dot_op)
		.attr("fill", "blue");
	
	leg1.append("circle")
		.attr("r", 5)
		.attr("cx", 335)
		.attr("cy", 5)
		.attr("opacity", dot_op)
		.attr("fill", "blue");
	
	leg1.append("text")
		.attr("x", 345)
		.attr("y", 8)
		.text("el tamaño representa la duración de la sesión"); //verdad?
	
	var leg2 = legend.append("div").append("svg")
		.attr("id", "leg2")
		.attr("class", "legend_components")
		.attr("width", 200)
		.attr("height", 12);
	
	leg2.append("circle")
		.attr("r", 5)
		.attr("cx", 10)
		.attr("cy", 5)
		.attr("opacity", dot_op)
		.attr("fill", "blue");
	
	leg2.append("text")
		.attr("x", 20)
		.attr("y", 8)
		.text("low pre-test");
	
	leg2.append("circle")
		.attr("r", 5)
		.attr("cx", 100)
		.attr("cy", 5)
		.attr("opacity", dot_op)
		.attr("fill", "red");
	
	leg2.append("text")
		.attr("x", 110)
		.attr("y", 8)
		.text("high pre-test");
}

drawLegend(dot_opacity);

//escalas

var date_scale = d3.scaleTime()
	.domain([new Date(2016, 8, 20), new Date(2016, 11, 20)])
    .range([padding, svg_w - padding]);

var nivel_scale = d3.scaleLinear()
	.domain([0, 15])	//domain de nivel
	.range([svg_h - padding, padding]); //invertido

var activity_contained_scale = d3.scaleLinear()
	.domain([0, 169])
	.range([1, 5]);
	

// ejes

var date_axis = d3.axisBottom(date_scale);

var nivel_names = ["variables", "", "comparisons", "if statements", "logical operators", 
	"loops", "output formatting", "functions", "lists", "strings", "dictionary", 
	"values references", "exceptions", "file handling", "classes & objects"]; 
var nivel_axis = d3.axisRight(nivel_scale)
	.ticks(15)
	.tickFormat(function(i) {
		return nivel_names[i-1];
	});

	    

// el bucle grande que hace todo para los tres svgs	  

for (var q = 0; q < 3; q++) {
	
	var svg = svg_array[q];
	
	// filter grupos
	group_data = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i].grupo == 2*q+1 || data[i].grupo == 2*q+2) 
		group_data.push(data[i]);
	}
	
	
	var dataset = [];
	for (var i = 0; i < group_data.length; i++) {           				
	    var la_fecha = new Date(group_data[i].Time*1000);
	    var newLevel = group_data[i].topicorder;
	    var pretest = group_data[i].Pretest;
	    var studentID = group_data[i].usuario;
	    var activity_contained = group_data[i].total_act;
	    dataset.push([la_fecha, newLevel, pretest, studentID, activity_contained]);	    
	}
	

	// hacer los puntos(circulos)
	var points = svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("r", function(d) {
			return dot_radius * activity_contained_scale(d[4]);
		})
		.attr("cx", function(d) {
			return date_scale(d[0]);
		})
		.attr("cy", function(d) {
			return nivel_scale(d[1]);
		})
		.attr("fill", function(d) {
			if (d[2] == 2) {
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
		
	// dialogue box
	var names = ["groups 1 & 2", "groups 3 & 4", "groups 5 & 6"];
	
	svg.append("text")
		.attr("id", "dialogue_box")
		.attr("transform", "translate(5, 15)")
		.style("opacity", d_box_opacity)
		.text(names[q]);
	
	// borders
	var translucent_borders = svg.append("g")
		.attr("id", "translucent_borders");
	
	translucent_borders.append("rect")
		.attr("x", -30)
		.attr("y", -10)
		.attr("width", 30)
		.attr("height", 170);
	
	translucent_borders.append("rect")
		.attr("x", svg_w - 50)
		.attr("y", -10)
		.attr("width", 100)
		.attr("height", 170);
			
	// dibuja los ejes
	svg.append("g")
		.attr("class", "axis")
		.attr("id", "x_axis")
		.attr("transform", "translate(0," + (svg_h - padding) + ")")
		.call(date_axis);
	
	svg.append("g")
		.attr("class", "axis")
		.attr("id", "y_axis")
		.attr("transform", "translate(" + (svg_w - padding - 40) + ", 0)")
		.call(nivel_axis);
}


// event handling -- el raton
d3.selectAll(".graphs").selectAll("circle")

	.on("mouseover", function(d) {
		var parent_svg = d3.select(this.parentNode);
		
		// otros alumnos se apagan
		parent_svg.selectAll("circle")
			.transition()
    		.attr("fill-opacity", function(d2) {
    			if (d[3] != d2[3]) {
    				return dot_opacity*.3;
    			}
    			else {return dot_opacity};
    		})
		
    	// alumno destacado
		parent_svg.selectAll("." + d[3])
			.transition()
      		//.attr("r", (dot_radius*1.2)/(Math.sqrt(scale_factor)))	
      		.attr("fill-opacity", .9);
		
		// texto
		/* parent_svg.selectAll("#dialogue_box")
			.text(d[3])
			.transition()
			.duration(400)
			.style("opacity", d_box_opacity);
		*/
		
	})		
	
	// regresa todo a normal
	.on("mouseout", function(d) {
		var parent_svg = d3.select(this.parentNode);
		
		parent_svg.selectAll("circle")
			.transition()
			.delay(100)
	      	//.attr("r", dot_radius/(Math.sqrt(scale_factor)))
	    	.attr("fill-opacity", dot_opacity);
		
		// texto
		/* parent_svg.selectAll("#dialogue_box")
			.transition()
			.duration(400)
			.style("opacity", 0);
		*/
	});


// ZOOMIN'

// crea el zoom
var zoom_handler = d3.zoom()
	.on("zoom", do_the_zoom)
	.scaleExtent([1,100])
	.translateExtent([[0, 0], [svg_w, svg_h]]);

// donde escuchar el zoom
var los_tres_svgs = d3.selectAll(".graphs");
los_tres_svgs.call(zoom_handler);

// que pasa en el zoom
function do_the_zoom() {
	var current_svg = d3.select(this);
	var el_transform = d3.event.transform;
	scale_factor = el_transform.scale(1).k;
	
	// transforma todos los circulos
	d3.selectAll(".graphs").selectAll("circle")
		.attr("transform", el_transform)
		// mantiene un radio chico
		.attr("r", function(d) {
			return (activity_contained_scale(d[4]) * dot_radius/(Math.sqrt(scale_factor)));
		});
	
	// selecciona los otros svgs
	var other_svgs = los_tres_svgs.filter( function() {
		return d3.select(this).attr("id") !== current_svg.attr("id");
	});
	
	// transforma los ejes
	d3.selectAll("#x_axis")
		.call(date_axis.scale(d3.event.transform.rescaleX(date_scale)));
	d3.selectAll("#y_axis")
		.call(nivel_axis.scale(d3.event.transform.rescaleY(nivel_scale)));
	
	// rompe un tipo de bucle - https://groups.google.com/forum/#!topic/d3-js/_36l7uHNYsQ
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return; }
	zoom_handler.transform(other_svgs, d3.event.transform);

}

    }); 
}

lee_json();

