var GOOGLE_ANALYTICS_ID = 'UA-53687338-1';

function GoogleAnalytics($window) {
  var ga = $window.ga;

  this.page = function(path) {
    ga('send', 'pageview', path);
  };

  this.user = function(id) {
    ga('set', 'userId', id);
  };

  this.reservationCreated = function(id) {
    ga('send', 'event', 'reservation', 'created', null, id);
  };

  this.reservationFinished = function(id) {
    ga('send', 'event', 'reservation', 'finished', null, id);
  };

  // Init GA client.
  ga('create', GOOGLE_ANALYTICS_ID, 'auto');
}

GoogleAnalytics.$inject = ['$window'];

module.exports = GoogleAnalytics;
