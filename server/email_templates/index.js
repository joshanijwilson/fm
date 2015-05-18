var fs = require('fs');
var hogan = require('hogan.js');


function loadEmailTemplate(name) {
  var lines = fs.readFileSync(__dirname + '/' + name, {encoding: 'utf8'}).split('\n');

  return {
    subject: hogan.compile(lines[0]),
    message: hogan.compile(lines.slice(2).join('\n'))
  };
}


module.exports = {
  reservationCreated: loadEmailTemplate('reservation_created.md'),
  reservationFinished: loadEmailTemplate('reservation_finished.md'),
  reservationReminder: loadEmailTemplate('reservation_reminder.md')
};
