var routes = require('./routes');

function configure($routeProvider, $datepickerProvider, $httpProvider) {
  angular.forEach(routes, function(route, pattern) {
    if (route.controller && route.controller.resolve) {
      route.resolve = route.controller.resolve;
    }

    $routeProvider.when(pattern, route);
  });

  angular.extend($datepickerProvider.defaults, {
    dateFormat: 'dd.MM.yyyy',
    autoclose: true,
    delay: {
      show: 0,
      hide: 0
    }
  });

  $httpProvider.interceptors.push('authInterceptor');
}

configure.$inject = ['$routeProvider', '$datepickerProvider', '$httpProvider'];

module.exports = configure;
