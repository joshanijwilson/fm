function ExistingController($scope, reservations, authUser) {
  if (authUser.is_admin) {
    $scope.reservations = reservations;
    $scope.showFinish = true;
  } else {
    $scope.reservations = reservations.filter(function(reservation) {
      return reservation.created_by === authUser.id;
    });
    $scope.showFinish = false;
  }
}

ExistingController.resolve = {
  dataReservations: function(dataSource) {
    return dataSource.getAllReservations();
  }
};


ExistingController.$inject = ['$scope', 'dataReservations', 'authUser'];
ExistingController.resolve.dataReservations.$inject = ['dataSource'];

module.exports = ExistingController;
