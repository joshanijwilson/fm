import java.util.Map;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;

import com.json.parsers.JSONParser;

// Takes an editable PDF document, fill in specified values and save as a new PDF document.
public class FillPDF {

  @SuppressWarnings("unchecked")
  public static void main(String[] args) throws IOException, COSVisitorException {
    // Parse CLI arguments:
    // --input inputFile.pdf
    // --output outputFile.pdf
    // --fields '{"field": "value"}'
    JSONParser parser = new JSONParser();

    String inputFile = null;
    String outputFile = null;
    Map<String, String> fields = null;

    int i = 0;
    while (i < args.length) {
      if (args[i].equals("--input")) {
        inputFile = args[i + 1];
        i = i + 2;
      } else if (args[i].equals("--output")) {
        outputFile = args[i + 1];
        i = i + 2;
      }
      else if (args[i].equals("--fields")) {
        fields = parser.parseJson(args[i + 1]);
        i = i + 2;
      } else {
        System.out.println("Unknown argument: " + args[i]);
        i++;
      }
    }


    // Open the PDF document.
    PDDocument doc = PDDocument.load(inputFile);


    // Fill in the fields.
    PDDocumentCatalog catalog = doc.getDocumentCatalog();
    PDAcroForm acroForm = catalog.getAcroForm();

    PDField field;
    for (Map.Entry<String, String> entry : fields.entrySet()) {
      field = acroForm.getField(entry.getKey());

      if (field == null) {
        System.out.println("No field '" + entry.getKey() + "' in this document!");
      } else {
        field.setValue(entry.getValue());
      }
    }


    // Save the changed document.
    doc.save(outputFile);
    doc.close();
  }
}
