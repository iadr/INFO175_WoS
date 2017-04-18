/**
 * Este archivo javascript contiene la aplicación principal. 
 * El punto de ejecución es la función $(window).ready que se ejecuta 
 * automáticamnete una vez que la página html que arga este .js 
 * termina de cargar
 */

var CONST = {
  uriServer  : "http://localhost:8080/Proto1/"  
};

var data = null;

/**
 * Esta función se llama en el call-back de getJSON en loadData
 * @param res representa la data leida del servicio. Se asume que 
 * contiene un arreglo con obetos JSON con los atributos userid, 
 * applabel y activitycount
 */
function displayData(res){
    data = res;
    // para poner la información leida en la página web (index.html)
    // accedemos al elemento con id working_area y le agregamos
    // un elemento html de tipo table, que tiene a su vez el id
    // "data_table".
    $( "#working_area" ).append("<table id=\"data_table\">");
    
    // secuencialmente agregamos filas (<tr>) y celdas (<td>) a la
    // tabla "data_table".  
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        $( "#data_table" ).append( "<tr><td>" + row.userid + "</td>" + "<td>" + row.applabel + "</td>" + "<td>" + row.activitycount + "</td></tr>\n");
    }
    
    //$( "#working_area" ).append("</table>");
}

/**
 * Esta función usa la función getJSON de jquery para hacer una llamada
 * a una dirección Web que devuelve un json. Aca llamamos al servicio 
 * GetSampleData implementado en Java y corriendo en el servidor tomcat.
 * getJSON es de jquery, y se reconoce porque se invoca desde el objeto $
 * El segundo parámetro de getJSON es un afunción de "call-back".Como 
 * la llamada AJAX producida por getJSON es asíncrona, la ejecución de getJSON 
 * no espera por la respuesta, sinó que pasa la "data" leida del servicio a una 
 * siguiente función. Esta es la forma como javascript secuencia llamadas 
 * asíncronas (leer un poco de AJAX sería bastante bueno!). 
 */
function loadData(){
    //var url = CONST.uriServer + "GetSampleData";
	var url = CONST.uriServer + "data.json";
    $.getJSON( url , function(data){
        displayData(data);
    });
}


$(window).ready(function() {
    loadData(); // llama a la función loadData más arriba
    
});
  