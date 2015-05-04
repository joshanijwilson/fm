var google = require('googleapis');
var moment = require('moment');
var q = require('q');

var diExpress = require('./di_express');
var inject = diExpress.inject;
var DbQuery = diExpress.DbQuery;

var config = require('../config').forCurrentEnvironment();
var token = config.calendarEvents.auth.token;
var secret = config.calendarEvents.auth.secret;
var calendarId = config.calendarEvents.calendarId;

// Google Calendar API
// https://developers.google.com/google-apps/calendar/v3/reference/#Events

inject(Calendar, DbQuery);
function Calendar(dbQuery) {
  var oauth2Client = new google.auth.OAuth2(secret.client_id, secret.client_secret, secret.redirect_uris[0]);
  var api = google.calendar({version: 'v3', auth: oauth2Client});

  oauth2Client.setCredentials(token);

  this.reservationCreated = function(reservationId) {
    if (!config.calendarEvents.enabled) {
      return q();
    }

    return dbQuery({sql: 'SELECT reservations.start, reservations.end, reservations.created_at, cars.name, users.first_name, users.last_name, customers.first_name, customers.last_name FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN users ON reservations.created_by = users.id WHERE reservations.id = ?', values: [reservationId], nestTables: true}).then(function(rows) {
      var row = rows[0];
      var reservation = row.reservations;
      var customer = row.customers;
      var user = row.users;
      var event = {
        id: 'reservation' + reservationId,
        start: {date: moment(reservation.start).format('YYYY-MM-DD')},
        end:{date: moment(reservation.end).format('YYYY-MM-DD')},
        summary: row.cars.name,
        description: 'Dealer: ' + user.first_name + ' ' + user.last_name + '\n' +
                     'Zákazník: ' + customer.first_name + ' ' + customer.last_name + '\n' +
                     'Rezervováno: ' + moment(reservation.created_at).format('DD.MM.YYYY') + '\n',
        reminders: {
          useDefault: false
        }
      };

      console.log('Creating calendar event', event);
      api.events.insert({calendarId: calendarId, resource: event}, function(err, events) {
        if (err) {
          console.log('An error occured', err);
          return;
        }
        console.log('Event created');
      });
    });
  };
}

module.exports = Calendar;
