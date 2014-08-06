var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('ALTER TABLE users ADD CONSTRAINT users_dealership_id FOREIGN KEY users_dealership_id(dealership_id) REFERENCES dealerships(id)', callback);
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE users DROP FOREIGN KEY users_dealership_id', callback);
};
