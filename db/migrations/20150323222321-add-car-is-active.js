var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('cars', 'is_active', {
    type: type.BOOLEAN,
    notNull: true,
    defaultValue: true
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('cars', 'is_active', callback);
};
