<h1>Servicios  </h1>

 ## ***Servicios01*** 

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

// STUDENT object:
{
  "studentid": "student123456",
  "pretest": 0.10, // 0-1
  "posttest": 0.67, // 0-1
  "pretest_binned": "low", // low/high
  
  "q_att": 9, // attempts to QUIZJET questions 
  "q_att_succ": 5, // attempts to QUIZJET questions that were correct
  "dist_q_att": 9, // number of distinct QUIZJET questions attempted
  "dist_q_att_succ": 9, // number of distinct QUIZJET questions attempted correclty at least once
  
  "p_att": 10, // attempts to PARSONS problems
  "p_att_succ": 9,  // attempts to PARSONS problems that were correct
  "dist_p_att": 5, // number of distinct PARSONS problems attempted
  "dist_p_att_succ": 5, // number of distinct PARSONS problems attempted correclty at least once
  
  "dist_e": 0, // distinct Examples (WEBEX) viewed
  "e_lines": 0, // total number of lines of Examples (WEBEX) viewed
  
  "dist_ae": 7, // distinct Animated Examples viewed
  "ae_lines": 37, // total number of lines of Animated Examples viewed
  
  "q_time": 600, // total amount of time spent in QUIZJET questions
  "p_time": 591, // total amount of time spent in PARSONS problems
  "e_time": 0, // total amount of time spent in Examples
  "ae_time": 155 // total amount of time spent in Animated Examples
}
```
## Consulta SQL
```SQL
select A.`user`, S.treatments_16 as vis, S.gender, S.pretest, S.posttest, S.pretest_binned,
	sum(if(A.appid=41,1,0)) as q_att, 
	sum(if(A.appid=41 AND A.result=1,1,0)) as q_att_succ, 
	count(distinct(if(A.appid=41,activityname,0)))-1 as dist_q_att, 
	count(distinct(if(A.appid=41 AND A.result=1,A.activityname,0)))-1 as dist_q_att_succ, 
	sum(if(A.appid=38,1,0)) as p_att, 
	sum(if(A.appid=38 AND result=1,1,0)) as p_att_succ, 
	count(distinct(if(A.appid=38,A.activityname,0)))-1 as dist_p_att, 
	count(distinct(if(A.appid=38 AND A.result=1,A.activityname,0)))-1 as dist_p_att_succ, 
	count(distinct(if(A.appid=3,A.parentname,0)))-1 as dist_e, 
	sum(if(A.appid=3,1,0)) as e_lines, 
	count(distinct(if(A.appid=35,A.parentname,0)))-1 as dist_ae, 
	sum(if(A.appid=35,1,0)) as ae_lines, 
	sum(if(A.appid=41,A.durationseconds,0)) as q_time, 
	sum(if(A.appid=38,A.durationseconds,0)) as p_time, 
	sum(if(A.appid=3,A.durationseconds,0)) as e_time, 
	sum(if(A.appid=35,A.durationseconds,0)) as ae_time 
from activity_traces A, student_info S 
	where A.`user` = S.`userid` and A.durationseconds > 0 and A.appid > -1 
	group by A.`user`
Procesamiento

gender : se codifica a female/male de los valores 0/1
pretest_binned : se codifica a low/high de los valores 1/2
