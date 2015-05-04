var dbm = require('db-migrate');
var type = dbm.dataType;
var helpers = require('../helpers');


exports.up = function(db, callback) {
  helpers.hackDbToSupportAfter(db);

  var finishOne = helpers.createFinisher(callback, 2);

  db.addColumn('reservations', 'protocol_doc_returned', {
    type: type.BOOLEAN,
    defaultValue: 0,
    notNull: true,
    after: 'identity_doc_url'
  }, finishOne);

  db.addColumn('reservations', 'survey_doc_returned', {
    type: type.BOOLEAN,
    defaultValue: 0,
    notNull: true,
    after: 'protocol_doc_url'
  }, finishOne);
};

exports.down = function(db, callback) {
  var finishOne = helpers.createFinisher(callback, 2);

  db.removeColumn('reservations', 'protocol_doc_returned', finishOne);
  db.removeColumn('reservations', 'survey_doc_returned', finishOne);
};
