var GOOGLE_ANALYTICS_ID = 'UA-53687338-1';

function GoogleAnalytics($window) {
  var ga = $window.ga;

  this.page = function(path) {
    ga('send', 'pageview', path);
  };

  this.user = function(id) {
    console.log('ga', 'user', id);
    ga('set', 'userId', id);
  };

  this.login = function(id) {
    ga('send', 'event', 'user', 'login', null, id);
  };

  this.loginFailed = function(error, email) {
    console.log('ga', 'login failed', error);
    ga('send', 'event', 'user', 'loginFailed', error, email);
  };

  this.reservationCreated = function(id) {
    ga('send', 'event', 'reservation', 'created', null, id);
  };

  this.reservationCompleted = function(id) {
    ga('send', 'event', 'reservation', 'completed', null, id);
  };

  this.reservationFinished = function(id) {
    ga('send', 'event', 'reservation', 'finished', null, id);
  };

  this.error = function(message, stack) {
    ga('send', 'exception', {'exDescription': message});
    ga('send', 'event', 'JavaScript Error', message, stack, {'nonInteraction': 1});
  };

  // Init GA client.
  ga('create', GOOGLE_ANALYTICS_ID, 'auto');
  console.log('ga', 'create', GOOGLE_ANALYTICS_ID);
}

GoogleAnalytics.$inject = ['$window'];

module.exports = GoogleAnalytics;
