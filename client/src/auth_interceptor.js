module.exports = function AuthInterceptor(localStorage, $q, $location, $rootScope, $injector) {
  var $http = null;
  var $route = null;

  // Requests that failed because of 401 and thus should be repeated after successfull
  // authentication.
  var requestsToRepeat = [];

  // Route that was active before navigating to /login page.
  // We will navigate to it after successfull authentication.
  var routeBeforeLogin = null;

  $rootScope.$on('$routeChangeStart', function(e, route) {
    console.log('routeChangeStart', route.$$route.originalPath)

    if (route.$$route.originalPath === '/login') {
      return;
    }

    // Discard previous requests.
    // The user probably navigated out of the login form.
    // ??? Should we reject these requests ???
    requestsToRepeat = [];

    routeBeforeLogin = route;
  });

  $rootScope.$on('auth', function() {
    // Work-around circular dependencies.
    $http = $http || $injector.get('$http');
    $route = $route || $injector.get('$route');

    // Patch the original route (before login), so that $route finishes the route change.
    // I know. This is insane.
    if (routeBeforeLogin) {
      $route.current = routeBeforeLogin;
    }

    requestsToRepeat.forEach(function(req) {
      console.log('Repeating', req.config.method, req.config.url);
      $http(req.config).then(function(response) {
        req.deferred.resolve(response);
      }, function(error) {
        req.deferred.reject(error);
      })
    });
  })

  this.request = function(config) {
    var token = localStorage.get('token');

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }

    return config;
  };

  this.responseError = function(response) {
    var deferred;

    if (response.status === 401) {
      deferred = $q.defer();
      requestsToRepeat.push({deferred: deferred, config: response.config});

      $location.path('/login');

      return deferred.promise;
    }

    return $q.reject(response);
  };
};

module.exports.$inject = ['localStorage', '$q', '$location', '$rootScope', '$injector'];
