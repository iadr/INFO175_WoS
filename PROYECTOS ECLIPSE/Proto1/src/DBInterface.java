import java.sql.*; 
import java.util.*;

/**
 * Esta clase implementa metodos de conexión y consula a una base de datos.
 * 
 * 
 *
 */
public class DBInterface {
	protected String dbString;
	protected String dbUser;
	protected String dbPass;
	
	protected Connection conn;
	protected Statement stmt = null; 
	protected ResultSet rs = null;
	
	public DBInterface(String connurl, String user, String pass){
		dbString = connurl;
		dbUser = user;
		dbPass = pass;
	}
	
	public boolean openConnection(){
		try{
			
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			
			conn = DriverManager.getConnection(dbString+"?"+ "user="+dbUser+"&password="+dbPass);
			if (conn!=null){
				return true;
			}
		}catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage()); 
			System.out.println("SQLState: " + ex.getSQLState()); 
			System.out.println("VendorError: " + ex.getErrorCode());
			return false;
		}catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		return true; 
	}
	
	public  void closeConnection(){
		releaseStatement(stmt, rs);
		if (conn != null){
			try{
				conn.close();
			}catch (SQLException sqlEx) { } 
		}
	}
	
	
	public  void releaseStatement(Statement stmt, ResultSet rs){
		if (rs != null) {
			try { 
				rs.close();
			}catch (SQLException sqlEx) { sqlEx.printStackTrace(); } 
			rs = null;
		}
		if (stmt != null) {
			try{
				stmt.close();
			}catch (SQLException sqlEx) { sqlEx.printStackTrace(); } 
			stmt = null;
		}
	}
	
	/**
	 * Ejemplo de metodo que hace una consulta a la base de datos
	 * (esta es una consulta de pruebas, que sólo trae información parcial
	 * @return
	 */
	public ArrayList<String[]> getData() {
		try {
			ArrayList<String[]> res = new ArrayList<String[]>();
			stmt = conn.createStatement();
			String query = "select `group`,`user`,`session`,`topicname`,topicorder,sum(if(appid=41,1,0)) as quizpet_att, "
					+ " sum(if(appid=41 AND result=1,1,0)) as quizpet_correct_att,"
					+ " count(*) as totalact,pretest_binned, round(avg(unixtimestamp),0) as time"
					+ " from activity_traces join student_info on activity_traces.`user`=student_info.userid "
					+ " where appid>0 "
					+ " group by `user`, `session`, `topicname`,`group`,topicorder;";
			rs = stmt.executeQuery(query);
			System.out.println(query);
			// rs contiene una estructura de tipo SET que contiene todas
			// las filas de la respuesta de la base de datos
			while (rs.next()) {
				String[] dataPoint = new String[9];
				dataPoint[0] = rs.getString("group"); // rs.getString obtiene el valor String de un campo especifico consultado, en este caso el campo "user". Notar que este nombre de campodebe coincidir con los campos en la consulta (SELECT `user`, ...) 
				dataPoint[1] = rs.getString("user");
				dataPoint[2] = rs.getString("session");
				dataPoint[3] = rs.getString("topicname");
				dataPoint[4] = rs.getString("topicorder");
				dataPoint[5] = rs.getString("quizpet_att");
				dataPoint[6] = rs.getString("totalact");
				dataPoint[7] = rs.getString("pretest_binned");
				dataPoint[8]=  rs.getString("time");
				res.add(dataPoint);
				
			}
			this.releaseStatement(stmt, rs);
			return res;
		}
		catch (Exception ex) {
			System.out.println("Exception: " + ex.getMessage());
			this.releaseStatement(stmt, rs);
			return null;
		}
	}
	
}
