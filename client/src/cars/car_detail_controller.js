function byStartDateAscending(a, b) {
  if (a.start < b.start) return -1;
  if (a.start > b.start) return 1;
  return 0;
}

function CarDetailController($scope, car, reservations, setPageTitleTo, authUser) {
  setPageTitleTo(car.spz + ' (' + car.name + ')');

  // We realy on reservations to be sorted when computing the distance for each reservation,
  // thus I will sort it on client so that it's harder to break this.
  reservations = reservations.sort(byStartDateAscending);

  var previousTachometer = 0;
  reservations.forEach(function(reservation) {
    if (!reservation.tachometer_end || previousTachometer === null) {
      reservation.distance = null;
      previousTachometer = null;
    } else {
      reservation.distance = reservation.tachometer_end - previousTachometer;
      previousTachometer = reservation.tachometer_end;
    }
  });

  $scope.car = car;
  $scope.reservations = reservations;
  $scope.authToken = authUser.urlToken;

  $scope.formatDistance = function(distance) {
    if (distance === null) return 'chybí';
    return distance + ' km';
  };
}

CarDetailController.resolve = {
  dataCar: function(dataSource, $route) {
    return dataSource.getCarById(parseInt($route.current.params.id));
  },
  dataReservations: function(dataSource, $route) {
    return dataSource.getReservationsByCarId(parseInt($route.current.params.id));
  }
};


CarDetailController.$inject = ['$scope', 'dataCar', 'dataReservations', 'pageTitle', 'authUser'];
CarDetailController.resolve.dataCar.$inject = ['dataSource', '$route'];
CarDetailController.resolve.dataReservations.$inject = ['dataSource', '$route'];

module.exports = CarDetailController;
