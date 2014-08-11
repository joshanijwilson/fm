function ReserveSuccessController($scope, reservation, loadingIndicator, dataSource, $location) {
  $scope.reservation = reservation;

  $scope.cancelReservation = function() {

    loadingIndicator.show();

    dataSource.deleteReservation(reservation.id).then(function() {
      $location.path('/reserve/' + reservation.id + '/canceled');
    }, function(response) {
      alert('ERROR ' + response.status);
      loadingIndicator.hide();
    });
  };
}

ReserveSuccessController.resolve = {
  dataReservation: function(dataSource, $route) {
    return dataSource.getReservation($route.current.params.id);
  }
};

ReserveSuccessController.$inject = ['$scope', 'dataReservation', 'loadingIndicator', 'dataSource', '$location'];
ReserveSuccessController.resolve.dataReservation.$inject = ['dataSource', '$route'];

module.exports = ReserveSuccessController;
