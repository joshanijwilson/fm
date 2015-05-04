var dbm = require('db-migrate');
var type = dbm.dataType;


exports.up = function(db, callback) {
  db.addColumn('reservations', 'finished_by', {
    type: type.INTEGER,
    length: 11,
    unsigned: true,
    notNull: false
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('reservations', 'finished_by', callback);
};
