var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('ALTER DATABASE fleet_manager DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci', callback);
};

exports.down = function(db, callback) {
  callback();
};
