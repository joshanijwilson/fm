var nodemailer = require('nodemailer');
var config = require('../config').forCurrentEnvironment();
var q = require('q');

// Create reusable transport method (opens pool of SMTP connections).
var smtpTransport = nodemailer.createTransport('SMTP', config.smtpTransport);

function SendEmail() {
  return sendEmail;
}

function sendEmail(from, to, subject, message, attachments) {
  console.log('sending email', from, to, subject, message);

  var deferred = q.defer();
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: message,
    // html: '<b>Hello world ✔</b>' // html body
    attachments: attachments
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}

var emailTemplates = require('./email_templates');

// TODO(vojta): copied like milion times, put it in a one place
var REASON_OPTIONS = {
  1: 'Vyzkoušení vlastností modelu před koupí',
  2: 'Testovací jízdy za účelem zveřejnění výsledků testování', // Marketing
  3: 'Náhradní vozidlo',
  4: 'Služební vozidlo, jiná zápůjčka' // Jiny duvod.
};


var moment = require('moment');
var diExpress = require('./di_express');
var inject = diExpress.inject;
var DbQuery = diExpress.DbQuery;

inject(EmailScheduler, DbQuery, SendEmail);
function EmailScheduler(dbQuery, sendEmail) {
  this.reservationCreated = function(reservationId) {
    // TODO(vojta): move to send() instead?
    if (!config.emailNotifications.enabled) {
      return q();
    }

    return dbQuery({sql: 'SELECT reservations.start, reservations.end, reservations.reason, cars.name, users.first_name, users.last_name, customers.first_name, customers.last_name FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN users ON reservations.created_by = users.id WHERE reservations.id = ?', values: [reservationId], nestTables: true}).then(function(rows) {
      var row = rows[0];
      var replacements = {
        reservation: row.reservations,
        car: row.cars,
        user: row.users,
        customer: row.customers
      };

      replacements.reservation.start = moment(replacements.reservation.start).format('D.M.YYYY');
      replacements.reservation.end = moment(replacements.reservation.end).format('D.M.YYYY');
      replacements.reservation.reason = REASON_OPTIONS[replacements.reservation.reason];

      return sendEmail(
        config.emailNotifications.from, config.emailNotifications.to,
        emailTemplates.reservationCreated.subject.render(replacements),
        emailTemplates.reservationCreated.message.render(replacements),
        // TODO(vojta): filename, path in nodemailer 1.x
        // TODO(vojta): extract the storage paths into "storage" module.
        [{fileName: 'Protokol.pdf', filePath: __dirname + '/../storage/reservations/' + reservationId + '-protocol.pdf'}]
      );
    });
  };

  this.reservationFinished = function(reservationId) {
    // TODO(vojta): move to send() instead?
    if (!config.emailNotifications.enabled) {
      return q();
    }

    return dbQuery({sql: 'SELECT reservations.start, reservations.end, reservations.reason, cars.name, users.first_name, users.last_name, customers.first_name, customers.last_name FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN users ON reservations.created_by = users.id WHERE reservations.id = ?', values: [reservationId], nestTables: true}).then(function(rows) {
      var row = rows[0];
      var replacements = {
        reservation: row.reservations,
        car: row.cars,
        user: row.users,
        customer: row.customers
      };

      replacements.reservation.start = moment(replacements.reservation.start).format('D.M.YYYY');
      replacements.reservation.end = moment(replacements.reservation.end).format('D.M.YYYY');
      replacements.reservation.reason = REASON_OPTIONS[replacements.reservation.reason];


      return sendEmail(
        config.emailNotifications.from, config.emailNotifications.to,
        emailTemplates.reservationFinished.subject.render(replacements),
        emailTemplates.reservationFinished.message.render(replacements),
        []
      );
    });
  };
}

module.exports = EmailScheduler;

// TODO(vojta): close the connection pool.
//smtpTransport.close();
