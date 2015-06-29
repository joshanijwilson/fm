var DEFAULT_URL = '/';

function AppController($scope, loadingIndicator, $location, authUser, track, setPageTitleTo) {
  setPageTitleTo.defaultTitle();

  // Update page title.
  $scope.$on('$routeChangeSuccess', function(e, current) {
    if (!current) {
      setPageTitleTo.defaultTitle();
      $scope.showMenuButton = true;
    } else {
      setPageTitleTo(current.$$route.title);
      $scope.showMenuButton = angular.isDefined(current.$$route.showMenuButton) ? current.$$route.showMenuButton : true;
    }

    track.page($location.path());
  });

  $scope.$on('$routeChangeStart', loadingIndicator.show);
  $scope.$on('$routeChangeSuccess', loadingIndicator.hide);
  $scope.$on('$routeChangeError', loadingIndicator.hide);

  // Show login form if the user is not authenticated.
  var initiallyRequestedPath = $location.path();

  if (!authUser.token && initiallyRequestedPath !== '/login') {
    $location.url('/login?redirect=' + (initiallyRequestedPath || DEFAULT_URL));
  }

  if (authUser.token) {
    track.user(authUser.id);
  }
}

AppController.$inject = ['$scope', 'loadingIndicator', '$location', 'authUser', 'analytics', 'pageTitle'];

module.exports = AppController;
