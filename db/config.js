var config = require('../config').forCurrentEnvironment();

module.exports = {
  "dev": {
    "driver"   : "mysql",
    "user"     : config.mysql.user,
    "password" : config.mysql.password,
    "host"     : config.mysql.host,
    "database" : config.mysql.database
  }
};
