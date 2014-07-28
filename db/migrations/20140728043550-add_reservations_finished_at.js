var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('reservations', 'finished_at', {
    type: type.TIMESTAMP,
    null: true
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('reservations', 'finished_at', callback);
};
