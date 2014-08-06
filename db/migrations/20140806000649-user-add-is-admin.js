var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('users', 'is_admin', {
    type: type.BOOLEAN,
    notNull: true
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('users', 'is_admin', callback);
};
