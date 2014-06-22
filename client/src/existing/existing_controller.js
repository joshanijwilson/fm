function ExistingController($scope, reservations) {
  $scope.reservations = reservations;

}

ExistingController.resolve = {
  dataReservations: function(dataSource) {
    return dataSource.getAllFutureReservations();
  }
};


ExistingController.$inject = ['$scope', 'dataReservations'];
ExistingController.resolve.dataReservations.$inject = ['dataSource'];

module.exports = ExistingController;
