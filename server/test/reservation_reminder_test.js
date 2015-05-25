// TODO: testing helpers for async (queue of promises), inject (injector per spec), use (load mocks), db pool per spec

var mysql = require('mysql');
var di = require('di');
var q = require('q');
var moment = require('moment');

var config = require('../../config').forCurrentEnvironment();
var pool = mysql.createPool(config.mysql);

var ReservationReminder = require('../reservation_reminder');
var EmailScheduler = require('../email_scheduler');
var diExpress = require('../di_express');


function cleanDB(done) {
  var spec = this;
  var query = 'DELETE FROM attachments;' +
              'DELETE FROM reservations;' +
              'ALTER TABLE reservations AUTO_INCREMENT = 1;' +
              'DELETE FROM users;' +
              'DELETE FROM dealerships;' +
              '';

  pool.query(query, null, function(err) {
    if (err) {
      spec.fail(err);
    }

    done();
  });
}

var dbQuery = diExpress.DbQuery(pool);

// TODO: extract into fixtures.
function forEachKey(obj, fn) {
  Object.keys(obj).forEach(function(key) {
    fn(obj[key], key);
  });
}

function insert(fixtures) {
  var fkMap = Object.create(null);
  var pending = [];
  var previousPending = q();

  forEachKey(fixtures, function(rows, tableName) {
    forEachKey(rows, function(row, rowId) {
      previousPending = previousPending.then(function() {
        var values = Object.create(null);

        // Resolve FK values.
        forEachKey(row, function(value, columnName) {
          if (value[0] === '#') {
            if (!fkMap[value]) {
              throw new Error('Foreign key ' + value + ' has to be inserted before using!');
            }
            values[columnName] = fkMap[value];
          } else {
            values[columnName] = value;
          }
        });

        return dbQuery('INSERT INTO ' + tableName + ' SET ?', values).then(function(result) {
          fkMap[rowId] = result.insertId;
        });
      });

    });
  });

  return previousPending.then(function() {
    return fkMap;
  });
}

describe('send_reminders', function() {
  beforeEach(cleanDB);

  it('should work', function(done) {
    var spec = this;

    var TODAY = moment(Date.now()).format('YYYY-MM-DD');
    var TOMORROW = moment(Date.now()).add(1, 'day').format('YYYY-MM-DD');

    // Fixtures.
    insert({
      dealerships: {
        '#Pruhonice': {name: 'Auto Pruhonice'}
      },
      users: {
        '#Joe': {first_name: 'Joe', last_name: 'Dealer', email: 'vojta.jina@gmail.com', dealership_id: '#Pruhonice'}
      },
      customers: {
        '#Mickey': {first_name: 'Mickey', last_name: 'Mouse'}
      },
      reservations: {
        '#1': {customer_id: '#Mickey', car_id: 1, start: '2015-05-21', end: TODAY, created_by: '#Joe'},
        '#2': {customer_id: '#Mickey', car_id: 2, start: '2015-05-22', end: TOMORROW, created_by: '#Joe'}
      }
    }).then(function() {
      var mockSend = jasmine.createSpy('mockSend').andReturn(q());
      var injector = new di.Injector([
        diExpress.bind(diExpress.DbPool).toValue(pool),
        diExpress.bind(EmailScheduler.SendEmail).toValue(mockSend)
      ]);

      return injector.get(ReservationReminder).sendReminders().then(function() {
        expect(mockSend).toHaveBeenCalled();
        expect(mockSend.callCount).toBe(1);

        var subject = mockSend.argsForCall[0][2];
        var message = mockSend.argsForCall[0][3];

        // TODO: do not depend on cars data outside of this test
        expect(subject).toBe('Rezervace V40 CC T5 AWD končí');
        expect(subject).toBe('Rezervace V40 CC T5 AWD končí');
        expect(message).toBe('Dobrý den,\n\n' +
                             'Vaše rezervace V40 CC T5 AWD končí zítra.\n\n' +
                             'Přihlaste se prosím a zadejte stav tachometru na adrese:\n' +
                             'http://localhost/#/complete/2\n\n' +
                             'Děkujeme.\n');
      });
    }).done(function() {
      pool.end();
      done();
    }, function(e) {
      spec.fail(e);
      pool.end();
      done();
    });
  });
});
