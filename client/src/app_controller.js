var DEFAULT_PAGE_TITLE = 'FleetManager';

function AppController($scope, loadingIndicator, $location, authUser) {
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
  });

  $scope.$on('$routeChangeStart', loadingIndicator.show);
  $scope.$on('$routeChangeSuccess', loadingIndicator.hide);
  $scope.$on('$routeChangeError', loadingIndicator.hide);

  // Initial page.
  // Show login form if the user is not authenticated.
  var initiallyRequestedPath = $location.path();

  if (!authUser.token && initiallyRequestedPath !== '/login') {
    var removeOnAuthListener = $scope.$on('auth', function() {
      $location.path(initiallyRequestedPath);
      removeOnAuthListener();
    });

    $location.path('/login');
  }
}

AppController.$inject = ['$scope', 'loadingIndicator', '$location', 'authUser'];

module.exports = AppController;
