var request = require('request');
var deasync = require('deasync');
var extend = require('node.extend');

var defaultConfig = require('./default');

// TODO(vojta): use execSync in 0.12 or make config async once injected.
var syncHttpGet = deasync(function(url, done) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      done(null, body);
    } else {
      done(error || response.statusCode);
    }
  }).on('error', function(e) {
    done(e);
  });
});

exports.forCurrentEnvironment = function() {
  var env = process.env.FM_ENV || 'prod';
  var envConfig = require('./' + env + '_env');
  var config = extend(true, {}, defaultConfig, envConfig);

  if (!config.publicHostname) {
    console.log('Getting public hostname from Amazon...');
    // If public hostname not set, get it from Amazon EC2 meta-data service.
    config.publicHostname = syncHttpGet('http://169.254.169.254/latest/meta-data/public-hostname');
  }

  return config;
};
