var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addIndex('users', 'users_email', ['email'], true, callback);
};

exports.down = function(db, callback) {
  db.removeIndex('users', 'users_email', callback);
};
