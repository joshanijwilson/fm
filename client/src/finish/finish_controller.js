function FinishController($scope, reservation, FileUploader, dataSource, loadingIndicator, $location) {
  $scope.reservation = reservation;

  $scope.finishReservation = function() {
    loadingIndicator.show();

    var updatedReservation = {
      id: reservation.id,
      tachometer_end: $scope.tachometerState,
      identity_doc_url: $scope.identityDocumentUrl,
      protocol_doc_url: $scope.protocolDocumentUrl,
      survey_doc_url:  $scope.surveyDocumentUrl
    };

    dataSource.updateReservation(updatedReservation).then(function(newReservation) {
      // TODO(vojta): better to get just "redirect" service that understands routes (instead of hard-coded urls)
      $location.path('/finish/' + reservation.id + '/success');
    }, function() {
      alert('ERROR');
      loadingIndicator.hide();
    });
  };

  $scope.isValid = function() {
    return $scope.form.$valid && $scope.identityDocumentUrl && $scope.protocolDocumentUrl && $scope.surveyDocumentUrl;
  };

  $scope.identityDocumentUrl = null;
  $scope.protocolDocumentUrl = null;
  $scope.surveyDocumentUrl = null;

  $scope.identityUploader = new FileUploader({
    url: '/storage/upload',
    autoUpload: true,
    onSuccessItem: function(item, response, status, headers) {
      $scope.identityDocumentUrl = headers['location'];

      while ($scope.identityUploader.queue.length > 1) {
        $scope.identityUploader.removeFromQueue(0);
      }
    }
  });
  $scope.protocolUploader = new FileUploader({
    url: '/storage/upload',
    autoUpload: true,
    onSuccessItem: function(item, response, status, headers) {
      $scope.protocolDocumentUrl = headers['location'];

      while ($scope.protocolUploader.queue.length > 1) {
        $scope.protocolUploader.removeFromQueue(0);
      }
    }
  });
  $scope.surveyUploader = new FileUploader({
    url: '/storage/upload',
    autoUpload: true,
    onSuccessItem: function(item, response, status, headers) {
      $scope.surveyDocumentUrl = headers['location'];

      while ($scope.surveyUploader.queue.length > 1) {
        $scope.surveyUploader.removeFromQueue(0);
      }
    }
  });
}

FinishController.resolve = {
  dataReservation: function(dataSource, $route) {
    return dataSource.getReservation($route.current.params.id);
  }
};


FinishController.$inject = ['$scope', 'dataReservation', 'FileUploader', 'dataSource', 'loadingIndicator', '$location'];
FinishController.resolve.dataReservation.$inject = ['dataSource', '$route'];

module.exports = FinishController;
