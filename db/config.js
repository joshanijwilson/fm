// This wraps the db config from ../config so that it can be consumed by db-migrate.

var config = require('../config').forCurrentEnvironment();

module.exports = {
  "dev": {
    "driver"   : "mysql",
    "user"     : config.mysql.user,
    "password" : config.mysql.password || "",
    "host"     : config.mysql.host,
    "database" : config.mysql.database
  }
};
