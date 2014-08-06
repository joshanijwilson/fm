var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('users', 'dealership_id', {
    type: type.INTEGER,
    length: 11,
    unsigned: true,
    notNull: true
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('users', 'dealership_id', callback);
};
