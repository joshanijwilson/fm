var routes = require('./routes');

function configure($routeProvider, $datepickerProvider) {
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
}

configure.$inject = ['$routeProvider', '$datepickerProvider'];

module.exports = configure;
