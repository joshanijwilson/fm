var mysql = require('mysql');

// TODO(vojta): Use testing db instead.
var config = require('../../config').forCurrentEnvironment();
var pool  = mysql.createPool(config.mysql);
var diExpress = require('../di-express');

var EmailScheduler = require('../email_scheduler');

// Mocks
var q = require('q');
var mockSend = jasmine.createSpy('mockSend').andReturn(q());

describe('send_mail', function() {
  it('should work', function(done) {
    var query = diExpress.DbQuery(pool);
    var spec = this;
    var scheduler = new EmailScheduler(query, mockSend);

    scheduler.reservationCreated(1).then(function() {
      expect(mockSend).toHaveBeenCalled();

      var subject = mockSend.argsForCall[0][2];
      var message = mockSend.argsForCall[0][3];

      expect(subject).toBe('Nová rezervace V40 D2 CROSS COUNTRY');
      expect(message).toBe('Od 22.6.2014, do 22.6.2014\n' +
                           'Dealer: Vojta Jína\n' +
                           'Zákazník: Ja vojta\n' +
                           'Účel: Vyzkoušení vlastností modelu před koupí\n');
    }).done(function(err) {
      pool.end();
      done();
    }, function(err) {
      pool.end();
      spec.fail(err);
      done();
    });
  });
});
