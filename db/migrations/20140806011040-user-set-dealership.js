var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('UPDATE users SET dealership_id = (SELECT id FROM dealerships LIMIT 1)', callback);
};

exports.down = function(db, callback) {
  db.runSql('UPDATE users SET dealership_id = 0', callback);
};
