var nodemailer = require('nodemailer');
var config = require('../config').forCurrentEnvironment();
var q = require('q');
var hogan = require('hogan.js');


// Create reusable transport method (opens pool of SMTP connections).
var smtpTransport = nodemailer.createTransport('SMTP', config.smtpTransport);

function send(from, to, subject, message) {
  console.log('sending email', from, to, subject, message);

  var deferred = q.defer();
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: message
    // html: '<b>Hello world ✔</b>' // html body
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}

var emailTemplates = {
  reservationCreated: {
    subject: hogan.compile('Nová rezervace: {{car.name}}'),
    message: hogan.compile('Je tu. Šmudlo.')
  }
};


exports.scheduleSendingEmailAfterRegistration = function() {
  if (!config.emailNotifications.enabled) {
    return q();
  }

  var replacements = {
    car: {
      name: 'S60 T6 AWD Polestar'
    }
  };

  return send(
    config.emailNotifications.from, config.emailNotifications.to,
    emailTemplates.reservationCreated.subject.render(replacements),
    emailTemplates.reservationCreated.message.render(replacements)
  );
};


// TODO(vojta): close the connection pool.
//smtpTransport.close();
