var moment = require('moment');
var q = require('q');

var EmailScheduler = require('./email_scheduler');
var diExpress = require('./di_express');
var inject = diExpress.inject;
var DbQuery = diExpress.DbQuery;


inject(ReservationReminder,  DbQuery, EmailScheduler);
function ReservationReminder(dbQuery, emailScheduler) {
  this.sendReminders = function() {
    var tomorrowDate = moment(Date.now()).add(1, 'day').format('YYYY-MM-DD');

    return dbQuery('SELECT id FROM reservations WHERE end = ?', [tomorrowDate]).then(function(rows) {
      console.log('rows', rows, tomorrowDate);
      return q.all(rows.map(function(row) {
        return emailScheduler.reservationReminder(row.id);
      }));
    });
  };
}

module.exports = ReservationReminder;
