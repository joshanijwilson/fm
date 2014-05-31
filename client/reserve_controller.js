function isCarAvailable(reservations, startDate, endDate) {
  if (!reservations) {
    return true;
  }

  for (var i = 0; i < reservations.length; i++) {
    if (endDate < reservations[i].start || startDate > reservations[i].end) {
      // Requested interval is before given reservation or after.
      continue;
    } else {
      return false;
    }
  }

  return true;
}


function cloneDate(date) {
  return new Date(date);
}


function ReserveController($scope) {
  var allModelOptions = [
    {id: 1, name: 'S60', available: true},
    {id: 2, name: 'S80', available: true},
    {id: 3, name: 'V40', available: false},
    {id: 4, name: 'V60', available: true},
    {id: 5, name: 'V70', available: true},
    {id: 6, name: 'XC60', available: true}
  ];

  var allCarOptions = [
    {id: 1, model: 'S80', description: 'T6 AWD 304k', color: 'black'},
    {id: 2, model: 'S60', description: 'T6 AWD 304k', color: 'red'},
    {id: 3, model: 'S60', description: 'D3 136k',     color: 'blue'},
    {id: 4, model: 'V60', description: 'D3 136k',     color: 'blue'},
    {id: 5, model: 'XC60', description: 'T6 306k',    color: 'white'}
  ];

  var futureReservationsByCar = {
    1: [{start: new Date(2014, 7, 1), end: new Date(2014, 7, 2)}],
    2: [{start: new Date(2014, 7, 1), end: new Date(2014, 7, 30)}]
  };

  $scope.modelOptions = allModelOptions;
  $scope.carOptions = allCarOptions;

  $scope.selectCar = function(car) {
    $scope.selectedCar = car;
  };

  $scope.submitReservation = function() {
    var reservation = {
      car_id: $scope.selectedCar.id,
      start: $scope.start,
      end: $scope.end,

      customer: $scope.customer,
      reason: $scope.reason
    };

    console.log(reservation);
  };

  $scope.filterCarsByModel = function(model) {
    $scope.carOptions = allCarOptions.filter(function(car) {
      return car.model === model.name;
    });
  };

  var updateCarsAvailability = function() {
    angular.forEach(allCarOptions, function(car) {
      car.available = isCarAvailable(futureReservationsByCar[car.id], $scope.startDate, $scope.endDate);
    });
  };

  $scope.startDateChanged = function() {
    if ($scope.endDate < $scope.startDate) {
      $scope.endDate = cloneDate($scope.startDate);
    }

    updateCarsAvailability();
  };

  $scope.endDateChanged = updateCarsAvailability;

  var NOW = new Date();
  var TODAY = $scope.TODAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0, 0, 0);

  $scope.selectedModel = null;
  $scope.selectedCar = null;
  $scope.startDate = cloneDate(TODAY);
  $scope.endDate = cloneDate(TODAY);
  $scope.customer = null;
  $scope.reason = null;

  updateCarsAvailability();
}
