module.exports = function AuthInterceptor(authUser, $q, $location, $rootScope, $injector) {
  var $http = null;
  var $route = null;

  // Requests that failed because of 401 and thus should be repeated after successfull
  // authentication.
  var requestsToRepeat = [];

  // Route that was active before navigating to /login page.
  // We will navigate to it after successfull authentication.
  var routeBeforeLogin = null;
  var routeChangeInProgress = false;

  $rootScope.$on('$routeChangeStart', function(e, route) {
    if (route.$$route.originalPath === '/login') {
      return;
    }

    // Discard previous requests.
    // The user probably navigated out of the login form.
    // ??? Should we reject these requests ???
    requestsToRepeat = [];

    routeBeforeLogin = route;
    routeChangeInProgress = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(e, route) {
    if (route.$$route.originalPath === '/login') {
      return;
    }

    routeChangeInProgress = false;
  });

  $rootScope.$on('$routeChangeError', function(e, route) {
    if (route.$$route.originalPath === '/login') {
      return;
    }

    routeChangeInProgress = false;
  });

  $rootScope.$on('auth', function() {
    // Work-around circular dependencies.
    $http = $http || $injector.get('$http');
    $route = $route || $injector.get('$route');

    var redirectUrlAfterLogin = $location.search()['redirect'];

    // Repeat the requests that failed due to 401.
    requestsToRepeat.forEach(function(req) {
      $http(req.config).then(function(response) {
        req.deferred.resolve(response);
      }, function(error) {
        req.deferred.reject(error);
      })
    });

    // TODO: remove /login and /<pathBeforeLogin from the url history.
    if (routeChangeInProgress) {
      // Requests were intercepted during a route change.
      // Patch the original route (before login), so that $route finishes the original $routeChange.
      // I know. This is insane.
      // TODO: Fix the url (it will be /login instead of the url before login).
      $route.current = routeBeforeLogin;
    } else if (redirectUrlAfterLogin) {
      // User navigated to /login.
      $location.url(redirectUrlAfterLogin);
    } else {
      // Requests were intercepted outside a route change.
      // Somebody else will do the redirect.
      // TODO: Revert to the url before login.
      // This is hard as simple navigating to that url is not enough.
      // We need to bring back the original state, including the controller,
      // so that the code that initiated the intercepted requests can safely execute.
    }
  })

  this.request = function(config) {
    if (authUser.token) {
      config.headers.Authorization = 'Bearer ' + authUser.token;
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

module.exports.$inject = ['authUser', '$q', '$location', '$rootScope', '$injector'];
