<h1>Servicios  </h1>

<h2> GetPointService </h2>

<h3>Descripcion </h2>

Version 1.0 de nuestro servicio, describe/muestra la actividad de todos los grupos segun lo que el usuario quiera ver.

<h3>Parametros</h2>

No recibe parametros

<h3>Salida</h2>

```javascript
{
  "users": [USER,...],
  "activity":[ACIVITY,...]
}

// USER object:
{
  "userid": 430, //cantidad de usuarios usando la app: 431, cantidad de alumnos: 684
  "pretest": 0.30, // entre 0 y 1
  "group": "group_162", //Grupo2 
  "pretest_binned": "low" // low/high
}

//ACTIVITY object:
{
  "Activity":
  {
    "userid":123
    "x-axii": 59, //unixtimestamp [septiembre-dic] (int (12))
    "y-axii": 30, /courseorder(int(string(255)))
    "type": "quizpet",
    "result": -1 // -1,0,1 Incorrecto, NN, Correcto
  }
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
