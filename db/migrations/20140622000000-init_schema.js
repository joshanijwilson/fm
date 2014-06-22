var dbm = require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');

var DROP_TABLES = '                    \
  DROP TABLE IF EXISTS `attachments`;  \
  DROP TABLE IF EXISTS `cars`;         \
  DROP TABLE IF EXISTS `customers`;    \
  DROP TABLE IF EXISTS `reservations`; \
  DROP TABLE IF EXISTS `users`;        \
';

exports.up = function(db, callback) {
  fs.readFile(__dirname + '/../init_schema.sql', function(err, initSchemaSql) {
    if (err) {
      throw err;
    }

    var pending = 0;
    var queries = initSchemaSql.toString().split(';');

    queries.forEach(function(query) {
      pending++;
      db.runSql(query, function() {
        if (--pending === 0) {
          callback();
        }
      });
    });
  });
};

exports.down = function(db, callback) {
  db.runSql(DROP_TABLES, callback);
};
