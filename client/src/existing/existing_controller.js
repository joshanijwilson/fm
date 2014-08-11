function ExistingController($scope, reservations, authUser) {
  if (authUser.is_admin) {
    $scope.reservations = reservations;
  } else {
    $scope.reservations = reservations.filter(function(reservation) {
      return reservation.created_by === authUser.id;
    });
  }
}

ExistingController.resolve = {
  dataReservations: function(dataSource) {
    return dataSource.getAllFutureReservations();
  }
};


ExistingController.$inject = ['$scope', 'dataReservations', 'authUser'];
ExistingController.resolve.dataReservations.$inject = ['dataSource'];

module.exports = ExistingController;
