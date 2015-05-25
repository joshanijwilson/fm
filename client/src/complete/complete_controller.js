function CompleteController($scope, reservation, dataSource, loadingIndicator, $location, track) {
  $scope.reservation = reservation;

  $scope.tachometerState = reservation.tachometer_end;
  $scope.note = null;

  $scope.completeReservation = function() {
    loadingIndicator.show();

    var updatedReservation = {
      id: reservation.id,
      tachometer_end: $scope.tachometerState
      // TODO(vojta): store note
    };

    dataSource.updateReservation(updatedReservation).then(function(newReservation) {
      track.reservationCompleted(reservation.id);
      // TODO(vojta): better to get just "redirect" service that understands routes (instead of hard-coded urls)
      $location.path('/complete/' + reservation.id + '/success');
    }, function(response) {
      alert('ERROR ' + response.status);
      loadingIndicator.hide();
    });
  };

  $scope.isValid = function() {
    return $scope.form.$valid;
  };
}

CompleteController.resolve = {
  dataReservation: function(dataSource, $route) {
    return dataSource.getReservation($route.current.params.id);
  }
};


CompleteController.$inject = ['$scope', 'dataReservation', 'dataSource', 'loadingIndicator', '$location', 'analytics'];
CompleteController.resolve.dataReservation.$inject = ['dataSource', '$route'];

module.exports = CompleteController;
