var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('users', 'phone', {
    type: type.STRING,
    length: 14
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('users', 'phone', callback);
};
