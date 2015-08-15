package fillpdf;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.apache.pdfbox.cos.COSString;
import org.apache.pdfbox.cos.COSName;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

// Takes an editable PDF document, fill in specified values and save as a new PDF document.
public class FillPDF {

  @SuppressWarnings("unchecked")
  public static void main(String[] args) throws IOException, COSVisitorException {
    // Parse CLI arguments:
    // --input inputFile.pdf
    // --output outputFile.pdf
    // --fields '{"field": "value"}'
    Gson parser = new Gson();
    Type mapType = new TypeToken<Map<String, String>>() {}.getType();

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
        fields = parser.fromJson(args[i + 1], mapType);
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
    String value;
    for (Map.Entry<String, String> entry : fields.entrySet()) {
      field = acroForm.getField(entry.getKey());

      if (field == null) {
        System.out.println("No field '" + entry.getKey() + "' in this document!");
      } else {
        value = entry.getValue() != null ? entry.getValue() : "";
        // This COSString crazy dance is here to make UTF8 characters (like Czech diacritics) work.
        field.getDictionary().setItem(COSName.V, new COSString(value));
      }
    }


    // Save the changed document.
    doc.save(outputFile);
    doc.close();
  }
}
