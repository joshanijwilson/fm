var fs = require('fs');

var CarBooks = require('../car_books');
var mysql = require('mysql');

// TODO(vojta): Use testing db instead.
var config = require('../../config').forCurrentEnvironment();
var pool  = mysql.createPool(config.mysql);
var diExpress = require('../di_express');
var open = require('open');


describe('car_books', function() {
  it('should work', function(done) {
    var query = diExpress.DbQuery(pool);
    var spec = this;
    var carBooks = new CarBooks(query);

    carBooks.bookFor(2, 2015).then().then(function(path) {
      expect(fs.existsSync(path)).toBe(true);
      console.log(path);
      open(path);
    }, function(err) {
      spec.fail(err);
    }).done(function() {
      console.log(arguments)
      pool.end();
      done();
    });
  });


  describe('reservationByDate', function() {
    var reservationByDate = CarBooks.reservationByDate;

    it('should work', function() {
      var resA = {start: new Date(2015, 4, 21), end: new Date(2015, 4, 24)};
      var resB = {start: new Date(2015, 4, 25), end: new Date(2015, 4, 25)};

      expect(reservationByDate([resA, resB], new Date(2015, 4, 22))).toBe(resA);
      expect(reservationByDate([resA, resB], new Date(2015, 4, 25))).toBe(resB);
      expect(reservationByDate([resA, resB], new Date(2015, 4, 26))).toBe(null);
    });
  });
});
