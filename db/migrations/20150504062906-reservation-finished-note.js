var dbm = require('db-migrate');
var type = dbm.dataType;


exports.up = function(db, callback) {
  db.addColumn('reservations', 'finished_note', {
    type: type.TEXT
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('reservations', 'finished_note', callback);
};
