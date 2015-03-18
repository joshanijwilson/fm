var DEFAULT_PAGE_TITLE = 'FleetManager';
var DEFAULT_URL = '/';

function AppController($scope, loadingIndicator, $location, authUser, track) {
  $scope.pageTitle = DEFAULT_PAGE_TITLE;

  // Update page title.
  $scope.$on('$routeChangeSuccess', function(e, current) {
    if (!current) {
      $scope.pageTitle = DEFAULT_PAGE_TITLE;
      $scope.pageHeader = DEFAULT_PAGE_TITLE;
      $scope.showMenuButton = true;
    } else {
      $scope.pageTitle = current.$$route.title ? DEFAULT_PAGE_TITLE + ': ' + current.$$route.title : DEFAULT_PAGE_TITLE;
      $scope.pageHeader = current.$$route.title || DEFAULT_PAGE_TITLE;
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

AppController.$inject = ['$scope', 'loadingIndicator', '$location', 'authUser', 'analytics'];

module.exports = AppController;
