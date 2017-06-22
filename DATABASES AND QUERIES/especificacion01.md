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
  "usuario": "noname160005", //cantidad de usuarios usando la app: 431, cantidad de alumnos: 684
  "pretest": 0.30, // entre 0 y 1
  "grupo": "GROUP161", //Grupo2 
  "pretest_binned": "low", // low/high
  "session": 0
}

//ACTIVITY object:
{
  "Activity":
  {
    "userid":123,
    "x-axii": 59, //unixtimestamp [septiembre-dic] (int (12))
    "y-axii": 30, //courseorder(int(string(255)))
    "topicname": "Comparison",
    "topicorder": 3,
    "type": "quizpet",
    "quizpet_att":1,
    "total_act":9
    "result": -1 // -1,0,1 Incorrecto, NN, Correcto
  }
}
```
## Consultas SQL
```SQL
//Activity Object
select `group`,`user`,`session`,`topicname`,topicorder,
sum(if(appid=41,1,0)) as quizpet_att,
sum(if(appid=41 AND result=1,1,0)) as quizpet_correct_att,
count(*) as totalact 
from activity_traces where appid>0 group by `group`,`user`, `session`, topicname, `topicorder`;

//User Object
select userid, pretest_binned, grp 
from student_info ;

//Activity + user Object
select S.userid , A.unixtimestamp as 'x-axii', A.courseorder as 'y-axii', A.applabel, A.result, S.pretest_binned, S.grp 
from student_info S, activity_traces A 
where A.`user`=S.userid and (applabel="quizpet" or 
applabel="parsons" or 
applabel="animated_example" or 
applabel="webex");
	
```
## 
