var fs = require('fs');
var path = require('path');

var pdfForms = require('../pdf_forms');
var mysql = require('mysql');

// TODO(vojta): Use testing db instead.
var config = require('../../config').forCurrentEnvironment();
var pool  = mysql.createPool(config.mysql);
var diExpress = require('../di-express');


// We pretend to run these tests in the root directory.
process.chdir(path.normalize(__dirname + '/../..'));


describe('pdf', function() {
  it('should work', function(done) {
    var query = diExpress.DbQuery(pool);
    var spec = this;

    pdfForms.scheduleGeneratingPdfForReservation(query, 1).then(function() {
      expect(fs.existsSync('./storage/reservations/1-protocol.pdf')).toBe(true);
      expect(fs.existsSync('./storage/reservations/1-survey.pdf')).toBe(true);
    }, function(err) {
      spec.fail(err);
    }).done(function() {
      pool.end();
      done();
    });
  });
});
