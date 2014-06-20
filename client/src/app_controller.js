var DEFAULT_PAGE_TITLE = 'FleetManager';

function AppController($scope, loadingIndicator) {
  $scope.pageTitle = DEFAULT_PAGE_TITLE;

  $scope.$on('$routeChangeSuccess', function(e, current) {
    if (!current) {
      $scope.pageTitle = DEFAULT_PAGE_TITLE;
      $scope.showMenuButton = true;
    } else {
      $scope.pageTitle = current.$$route.title || DEFAULT_PAGE_TITLE;
      $scope.showMenuButton = angular.isDefined(current.$$route.showMenuButton) ? current.$$route.showMenuButton : true;
    }

    loadingIndicator.hide();
  });
}

AppController.$inject = ['$scope', 'loadingIndicator'];

module.exports = AppController;
