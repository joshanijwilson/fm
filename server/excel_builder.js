// Generic building of MS Excel documents, not coupled to FM.

var os = require('os');
var excel = require('msexcel-builder');
var q = require('q');


function maxColumns(rows) {
  return rows.reduce(function(currentMax, row) {
    return Math.max(currentMax, row.length);
  }, 0);
}

exports.generateFile = function generateExcelFile(data) {
  var workbook = excel.createWorkbook(os.tmpdir(), 'book.xlsx');

  data.sheets.forEach(function(sheet) {
    var xlsSheet = workbook.createSheet(sheet.title, maxColumns(sheet.rows), sheet.rows.length);
    var cell;
    for (var r = 0; r < sheet.rows.length; r++) {
      for (var c = 0; c < sheet.rows[r].length; c++) {
        cell = sheet.rows[r][c];
        xlsSheet.set(c + 1, r + 1, cell.value);
        if (cell.fontStyle) {
          xlsSheet.font(c + 1, r + 1, cell.fontStyle);
        }
        if (cell.fillStyle) {
          xlsSheet.fill(c + 1, r + 1, cell.fillStyle);
        }
      }
    }
  });

  return q.ninvoke(workbook, 'save');
}
