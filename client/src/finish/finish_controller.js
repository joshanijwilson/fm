function FinishController($scope, reservation, dataSource, loadingIndicator, $location, track) {
  $scope.reservation = reservation;

  $scope.protocolReturned = false;
  $scope.surveyReturned = false;
  $scope.tachometerState = reservation.tachometer_end;
  $scope.note = null;

  $scope.finishReservation = function() {
    loadingIndicator.show();

    var updatedReservation = {
      id: reservation.id,
      finished_at: $scope.isFinished() ? 'NOW' : null,
      tachometer_end: $scope.tachometerState,
      protocol_doc_returned: $scope.protocolReturned,
      survey_doc_returned: $scope.surveyReturned,
      finished_note: $scope.note
    };

    dataSource.updateReservation(updatedReservation).then(function(newReservation) {
      track.reservationFinished(reservation.id);
      // TODO(vojta): better to get just "redirect" service that understands routes (instead of hard-coded urls)
      $location.path('/finish/' + reservation.id + '/success');
    }, function(response) {
      alert('ERROR ' + response.status);
      loadingIndicator.hide();
    });
  };

  $scope.isValid = function() {
    return $scope.form.$valid;
  };

  $scope.isFinished = function() {
    return $scope.protocolReturned && $scope.surveyReturned && $scope.tachometerState;
  };
}

FinishController.resolve = {
  dataReservation: function(dataSource, $route) {
    return dataSource.getReservation($route.current.params.id);
  }
};


FinishController.$inject = ['$scope', 'dataReservation', 'dataSource', 'loadingIndicator', '$location', 'analytics'];
FinishController.resolve.dataReservation.$inject = ['dataSource', '$route'];

module.exports = FinishController;
