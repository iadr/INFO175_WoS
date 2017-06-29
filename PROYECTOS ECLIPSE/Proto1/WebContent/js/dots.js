// wooooohooo
var ig=0;
var datar=[]
  function lee_json() {
    $.getJSON("data.json",function(data){

//data tiene los elementos de data.json
//ejemplo de acceso a data
//data[0].usuario ->return noname160005
// variables globales
var svg_w = 800;
var svg_h = 150;
var padding = 10;



var dot_opacity = .4;
var dot_radius = 2;

var d_box_opacity = .7;

var scale_factor = 1;


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
var nivel_axis = d3.axisRight(nivel_scale);


// el bucle grande que hace todo para los tres svgs
for (var q = 0; q < 3; q++) {
	var svg = svg_array[q];
	
	//input ejemplos
	//2016-12-01 15:19:10.0
	//2016-11-30 14:38:21.0
	
	// dataset aleatorio
	var dataset = [];
	for (var i = 0; i < data.length; i++) {           				
		//fecha aleatoria - glitch de meses con menos de 31 dias? 
	    var la_fecha = new Date(2016, 
	    		Math.round(Math.random() * 4) + 2, 
	    		Math.round(Math.random() * 31), 
	    		Math.round(Math.random() * 23), 
	    		Math.round(Math.random() * 60), 
	    		Math.round(Math.random() * 60));
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
		.attr("r", dot_radius) 
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
		.attr("x", 790)
		.attr("y", -10)
		.attr("width", 40)
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
		.attr("transform", "translate(" + (svg_w - padding) + ", 0)")
		.call(nivel_axis);
}


// event handling -- el raton
d3.selectAll("svg").selectAll("circle")

	.on("mouseover", function(d) {
		var parent_svg = d3.select(this.parentNode);
		
		// otros alumnos se apagan
		parent_svg.selectAll("circle")
			.transition()
    		.attr("fill-opacity", function(d2) {
    			if (d[3] != d2[3]) {
    				return dot_opacity*.4;
    			}
    			else {return dot_opacity};
    		})
		
    	// alumno destacado
		parent_svg.selectAll("." + d[3])
			.transition()
      		.attr("r", (dot_radius*1.2)/(Math.sqrt(scale_factor)))	
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
		
		d3.selectAll("circle")
			.transition()
			.delay(100)
	      	.attr("r", dot_radius/(Math.sqrt(scale_factor)))
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
var los_tres_svgs = d3.select("#interface").selectAll("svg");
los_tres_svgs.call(zoom_handler);

// que pasa en el zoom
function do_the_zoom() {
	var current_svg = d3.select(this);
	var el_transform = d3.event.transform;
	scale_factor = el_transform.scale(1).k;
	
	// transforma todos los circulos
	d3.selectAll("circle")
		.attr("transform", el_transform)
		// mantiene un radio chico
		.attr("r", function() {
			return (dot_radius/(Math.sqrt(scale_factor)));
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

