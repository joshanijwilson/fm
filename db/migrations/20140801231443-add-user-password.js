var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('users', 'password_hash', {
    type: type.STRING,
    length: 60
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('users', 'password_hash', callback);
};
