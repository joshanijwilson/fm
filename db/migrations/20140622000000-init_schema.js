var dbm = require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');

var DROP_TABLES = '                    \
  SET FOREIGN_KEY_CHECKS = 0;          \
  DROP TABLE IF EXISTS `attachments`;  \
  DROP TABLE IF EXISTS `cars`;         \
  DROP TABLE IF EXISTS `car_models`;  \
  DROP TABLE IF EXISTS `customers`;    \
  DROP TABLE IF EXISTS `reservations`; \
  DROP TABLE IF EXISTS `users`;        \
';

function runMultipleStatements(db, sql, callback) {
  var queries = sql.split(';');
  var pending = 0;

  queries.forEach(function(query) {
    pending++;
    db.runSql(query, function() {
      if (--pending === 0) {
        callback();
      }
    });
  });
}

exports.up = function(db, callback) {
  fs.readFile(__dirname + '/../init_schema.sql', function(err, initSchemaSql) {
    if (err) {
      throw err;
    }

    runMultipleStatements(db, initSchemaSql.toString(), callback);
  });
};

exports.down = function(db, callback) {
  runMultipleStatements(db, DROP_TABLES, callback);
};
