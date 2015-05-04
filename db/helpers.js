var util = require('util');

exports.createFinisher = function(callback, count) {
  return function() {
    count--;
    if (count === 0) {
      callback();
    }
  };
};

// TODO(vojta): merge into db-migrate
exports.hackDbToSupportAfter = function(db) {
  var original__createColumnDef = db.createColumnDef;
  db.createColumnDef = function(name, spec, options) {
    var def = original__createColumnDef.apply(this, arguments);

    if (spec.after) {
      def += util.format(' AFTER `%s`', spec.after);
    }

    return def;
  };
};
