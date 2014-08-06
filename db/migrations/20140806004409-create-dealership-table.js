var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('dealerships', {
    id: {type: type.INTEGER, length: 11, primaryKey: true, autoIncrement: true, unsigned: true},
    name: {type: type.STRING, length: 50, notNull: true}
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('dealerships', callback);
};
