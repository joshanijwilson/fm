

function ReserveSuccessController($scope, dataReservation) {
  $scope.reservation = dataReservation;
}

ReserveSuccessController.resolve = {
  dataReservation: function(dataSource, $route) {
    return dataSource.getReservation($route.current.params.id);
  }
};
