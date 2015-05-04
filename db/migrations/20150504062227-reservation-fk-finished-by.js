var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('ALTER TABLE reservations ADD CONSTRAINT reservations_finished_by FOREIGN KEY reservations_finished_by(finished_by) REFERENCES users(id)', callback);
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE reservations DROP FOREIGN KEY reservations_finished_by', callback);
};
