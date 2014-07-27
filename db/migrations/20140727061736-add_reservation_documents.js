var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  var pending = 3;
  var done = function() {
    pending--;
    if (!pending) {
      callback();
    }
  }

  db.addColumn('reservations', 'identity_doc_url', {
    type: type.STRING,
    length: 50
  }, done);

  db.addColumn('reservations', 'protocol_doc_url', {
    type: type.STRING,
    length: 50
  }, done);

  db.addColumn('reservations', 'survey_doc_url', {
    type: type.STRING,
    length: 50
  }, done);
};

exports.down = function(db, callback) {
  var pending = 3;
  var done = function() {
    pending--;
    if (!pending) {
      callback();
    }
  }

  db.removeColumn('reservations', 'identity_doc_url', done);
  db.removeColumn('reservations', 'protocol_doc_url', done);
  db.removeColumn('reservations', 'survey_doc_url', done);
};
