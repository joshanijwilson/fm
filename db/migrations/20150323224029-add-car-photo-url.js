var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('cars', 'photo_url', {
    type: type.STRING,
    length: 50
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('cars', 'photo_url', callback);
};
