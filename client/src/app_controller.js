var DEFAULT_PAGE_TITLE = 'FleetManager';

function AppController($scope, loadingIndicator, $location, localStorage) {
  $scope.pageTitle = DEFAULT_PAGE_TITLE;

  // Update page title and hide loading indicator.
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

    loadingIndicator.hide();
  });

  // Show login form if the user is not authenticated.
  if (!localStorage.get('token')) {
    $location.path('/login');
  }
}

AppController.$inject = ['$scope', 'loadingIndicator', '$location', 'localStorage'];

module.exports = AppController;
