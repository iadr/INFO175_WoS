<h1>Servicios  </h1>



<h3>Descripcion </h2>

Version 1.8 de nuestro servicio, describe/muestra la actividad de todos los grupos segun lo que el usuario quiera ver.


<h3>Salida</h2>

```javascript
{
  user+activity: [...]
}

// user+activity object:

["grupo":1,"usuario":"noname1654","session":0,"topicname":"if statement",
,"topicorder":3,"quizpet_att":6,"total_act":8,"Pretest":2,"Time":1888783129];




```
## Consultas SQL
```SQL


//Activity + user Object
select `group`,`user`,`session`,`topicname`,topicorder,sum(if(appid=41,1,0)) as quizpet_att,
sum(if(appid=41 AND result=1,1,0)) as quizpet_correct_att,
count(*) as totalact,pretest_binned, round(avg(unixtimestamp),0) as time
from activity_traces join student_info on activity_traces.`user`=student_info.userid
where appid>0
group by `user`, `session`, `topicname`,`group`,topicorder;
	
```
## 
