var extend = require('node.extend');
var defaultConfig = require('./default');

exports.forCurrentEnvironment = function() {
  var env = process.env.FM_ENV || 'prod';
  var envConfig = require('./' + env + '_env');

  return extend(true, {}, defaultConfig, envConfig);
};
