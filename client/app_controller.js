var DEFAULT_PAGE_TITLE = 'FleetManager';

function AppController($scope, loadingIndicator) {
  $scope.pageTitle = DEFAULT_PAGE_TITLE;

  $scope.$on('$routeChangeSuccess', function(e, current) {
    $scope.pageTitle = current.$$route.title || DEFAULT_PAGE_TITLE;
    loadingIndicator.hide();
  });
}

AppController.$inject = ['$scope', 'loadingIndicator'];
