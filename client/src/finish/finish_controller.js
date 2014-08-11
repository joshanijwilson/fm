function FinishController($scope, reservation, FileUploader, dataSource, loadingIndicator, $location) {
  $scope.reservation = reservation;
  $scope.tachometerState = null;
  $scope.fuelState = 50;

  $scope.finishReservation = function() {
    loadingIndicator.show();

    var updatedReservation = {
      id: reservation.id,
      finished_at: 'NOW',
      tachometer_end: $scope.tachometerState,
      fuel_end: $scope.fuelState,
      identity_doc_url: $scope.identityDocumentUrl,
      protocol_doc_url: $scope.protocolDocumentUrl,
      survey_doc_url:  $scope.surveyDocumentUrl
    };

    dataSource.updateReservation(updatedReservation).then(function(newReservation) {
      // TODO(vojta): better to get just "redirect" service that understands routes (instead of hard-coded urls)
      $location.path('/finish/' + reservation.id + '/success');
    }, function(response) {
      alert('ERROR ' + response.status);
      loadingIndicator.hide();
    });
  };

  $scope.isValid = function() {
    return $scope.form.$valid && $scope.identityDocumentUrl && $scope.protocolDocumentUrl && $scope.surveyDocumentUrl;
  };

  $scope.identityDocumentUrl = null;
  $scope.protocolDocumentUrl = null;
  $scope.surveyDocumentUrl = null;
}

FinishController.resolve = {
  dataReservation: function(dataSource, $route) {
    return dataSource.getReservation($route.current.params.id);
  }
};


FinishController.$inject = ['$scope', 'dataReservation', 'FileUploader', 'dataSource', 'loadingIndicator', '$location'];
FinishController.resolve.dataReservation.$inject = ['dataSource', '$route'];

module.exports = FinishController;
