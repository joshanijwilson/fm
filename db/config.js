var config = require('../config').forCurrentEnvironment();
var mysqlConfig = config.mysql;

module.exports = {
  "dev": {
    "driver"   : "mysql",
    "user"     : mysql.user,
    "password" : mysql.password,
    "host"     : mysql.host,
    "database" : mysql.database
  }
};
