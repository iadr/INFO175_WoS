

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class GetData
 * 
 * Ver el método doGet
 */
@WebServlet("/GetData")
public class GetData extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private DBInterface dbInterface; // dbInterface es para conectarse a la base de datos
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetData() {
        super();
    }

	/**
	 * doGet es invocada cuando un servlet es llamado con método http GET, que es lo mismo
	 * que cargar su URL en un browser.
	 * 
	 * Los parámetros sonobjetos útiles que nos sirven para saber más de la llamada (request)
	 * y para escribir la respuesta HTTP (response)
	 * 
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// Usamos esta clase ConfigManager para leer y cargar variables de configuración 
		// definidas en el archivo config.xml
		ConfigManager cm = new ConfigManager(this);
		
		// Un ejemplo de como capturar un parametr de url. Si el paramtero no viene en la url, la variable se le asignará null
		String userId = request.getParameter("userid");
		
		// otro ejemplo de paramtero entero donde hay involucrada una conversión a int. Al final
		// resulta más fácil manejar la exception que tratar de validar de otra forma
		int limit = -1;
		try{
			limit = Integer.parseInt(request.getParameter("limit"));
		}
		catch(Exception e){
			limit = -1;
		}
		
		// Se inicializa el objeto de conexión a la base de datos
		dbInterface = new DBInterface(cm.dbString, cm.dbUser, cm.dbPass);
		dbInterface.openConnection(); // abrir la conexión
		
		// llamada a la función getData que hace la consulta a la base de datos
		ArrayList<String[]> data = dbInterface.getData(); 
		dbInterface.closeConnection(); // cerrar la conexión
		
		// obtener el objeto flujo de salida (para imprimir la respuesta)
		PrintWriter out = response.getWriter();
		
		// escribir la respuesta
		out.print(outAsJSON(data));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// si queremos que elservicio haga lomismo si es cargado con protocolo POST 
		// entonces podemos simplemente llamar doGet
		doGet(request,response);
	}
	
	/**
	 * Este metodo escribe en formato JSON la data obtenida desde la base de datos
	 * 
	 * @param data
	 * @return
	 */
	private String outAsJSON(ArrayList<String[]> data){
		System.out.println("Starting JSON conversion");
		String outString = "[";
		for(String[] row : data){
			System.out.print(".");
			if(row[7].length()==0) row[7]="1";
			outString += "\n {\"grupo\":\""+row[0]+"\",\"usuario\":\""+row[1]+"\",\"session\":"+row[2]+",\"topicname\":\""+row[3]+"\",\"topicorder\":"+row[4]+",\"quizpet_att\":"+row[5]+",\"total_act\":"+row[6]+",\"Pretest\":"+row[7]+",\"Time\":"+row[8]+"},";
		}
		System.out.println("Finishing JSON conversion");
		outString = outString.substring(0,outString.length()-1);
		outString += "\n]";
		return outString;
	}

}
