var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('customers', 'address', {type: type.STRING, length: 100}, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('customers', 'address', callback);
};
