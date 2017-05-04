import java.io.InputStream;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;

/**
 * Esta clase permite leer datos de un archivo .xml usando el parser de xml 
 * de la API de java en javax.xml.parsers
 *  
 * @author Julio Guerra
 *
 */
public class ConfigManager {
	public String dbString;
	public String dbUser;
	public String dbPass;

	private static String config_string = "./WEB-INF/config.xml";

	public ConfigManager(HttpServlet servlet) {
		try {
			ServletContext context = servlet.getServletContext();
			InputStream input = context.getResourceAsStream(config_string);
			if (input != null) {
				DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
				DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
				Document doc = dBuilder.parse(input);
				doc.getDocumentElement().normalize();

				dbString = doc.getElementsByTagName("dbString").item(0).getTextContent();
				dbUser = doc.getElementsByTagName("dbUser").item(0).getTextContent();
				dbPass = doc.getElementsByTagName("dbPass").item(0).getTextContent();

				dbString = doc.getElementsByTagName("dbString").item(0).getTextContent();
			}
			else {
				System.out.println("config not found!");
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

}
