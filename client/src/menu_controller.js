
function MenuController($scope, authUser) {
  $scope.showCarsButton = authUser.is_admin;
}
MenuController.$inject = ['$scope', 'authUser'];

module.exports = MenuController;
