var DEFAULT_PAGE_TITLE = 'FleetManager';

function AppController($scope) {
  $scope.pageTitle = DEFAULT_PAGE_TITLE;

  $scope.$on('$routeChangeSuccess', function(e, current) {
    $scope.pageTitle = current.$$route.title || DEFAULT_PAGE_TITLE;
  });
}
