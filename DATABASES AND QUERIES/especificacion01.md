<h1>Servicios  </h1>



<h2>Descripcion </h2>

Version 1.0 de nuestro servicio, describe/muestra la actividad de todos los grupos segun lo que el usuario quiera ver.

<h2>Parametros</h2>

No recibe parametros

<h2>Salida</h2>

```javascript
[
  STUDENT,
  ...
]

// Progress object:
{
  "applabel": "QUIZPET", //aplicacion ocupada
  "user": "noname160063" //nombre con el que se identifica al usuario
  "pretest": 0.09, // nivel de pretest 0-1 (0 bajo, 1 alto)
  
  "group": GROUP161, // grupo al que pertenece 

  "datestring": "2016-12-01 12:27:07", // fecha y hora en que fue usada
  
  
}
```
## Consulta SQL
```SQL
SELECT applabel, A.`user`,S.pretest,A.`group`,
datestring from activity_traces A,student_info S
where A.`user`=S.userid and 
(applabel="quizpet" or 
applabel="parsons" or 
applabel="animated_example" or 
applabel="webex");
	
```
## 
