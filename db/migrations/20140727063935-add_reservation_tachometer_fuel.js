var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  var pending = 2;
  var done = function() {
    pending--;
    if (!pending) {
      callback();
    }
  };

  db.addColumn('reservations', 'tachometer_end', {
    type: type.INTEGER
  }, done);

  db.addColumn('reservations', 'fuel_end', {
    type: type.INTEGER
  }, done);
};

exports.down = function(db, callback) {
  var pending = 2;
  var done = function() {
    pending--;
    if (!pending) {
      callback();
    }
  };

  db.removeColumn('reservations', 'tachometer_end', done);
  db.removeColumn('reservations', 'fuel_end', done);
};
