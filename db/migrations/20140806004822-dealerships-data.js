var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.insert('dealerships', ['name'], ['Autoprůhonice'], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM dealerships', callback);
};
