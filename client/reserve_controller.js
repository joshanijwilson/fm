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

function getTodayDate() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
}

function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0
}

function filterCarModelsFromCars(cars) {
  var models = [];
  var alreadyIn = {};

  cars.forEach(function(car) {
    if (!alreadyIn[car.model_id]) {
      alreadyIn[car.model_id] = true;
      models.push({id: car.model_id, name: car.model_name});
    }
  });

  return models.sort(byName);
}


var REASON_OPTIONS = [
  {id: 1, title: 'Vyzkoušení vlastností modelu před koupí'},
  {id: 2, title: 'Testovací jízdy za účelem zveřejnění výsledků testování'}, // Marketing
  {id: 3, title: 'Náhradní vozidlo'},
  {id: 4, title: 'Služební vozidlo, jiná zápůjčka'} // Jiny duvod.
];


function ReserveController($scope, $location, dataSource, dataCars, loadingIndicator) {
  var allCarOptions = dataCars;
  var allModelOptions = [{id: null, name: 'Zobrazit všechny modely'}].concat(filterCarModelsFromCars(dataCars));
  var futureReservationsByCar = {};

  $scope.selectCar = function(car) {
    $scope.selectedCar = car;
  };

  $scope.submitReservation = function() {
    // validation
    // - car selected
    // - car available
    // - start/end (now < start < end)
    var reservation = {
      car_id: $scope.selectedCar.id,
      start: $scope.startDate,
      end: $scope.endDate,

      // TODO(vojta): set proper id or inline (with email/phone)
      customer: $scope.customer,
      reason: $scope.selectedReason.id,
      note: $scope.note
    };

    loadingIndicator.show();
    dataSource.createReservation(reservation).then(function(newReservation) {
      // TODO(vojta): better to get just "redirect" service that understands routes (instead of hard-coded urls)
      $location.path('/reserve/' + newReservation.id + '/success');
      loadingIndicator.hide();
    }, function() {
      alert('ERROR');
      loadingIndicator.hide();
    });
  };

  $scope.filterCarsByModel = function(model) {
    if (model.id === null) {
      $scope.carOptions = allCarOptions;
      return;
    }

    $scope.carOptions = allCarOptions.filter(function(car) {
      return car.model_id === model.id;
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

  var TODAY = $scope.TODAY = getTodayDate();

  $scope.modelOptions = allModelOptions;
  $scope.carOptions = allCarOptions;
  $scope.selectedModel = allModelOptions[0];
  $scope.selectedCar = null;
  $scope.startDate = cloneDate(TODAY);
  $scope.endDate = cloneDate(TODAY);
  $scope.customer = null;
  $scope.reasonOptions = REASON_OPTIONS;
  $scope.selectedReason = REASON_OPTIONS[0];

  updateCarsAvailability();

  dataSource.getAllFutureReservations().then(function(reservations) {
    reservations.forEach(function(reservation) {
      futureReservationsByCar[reservation.car_id] = futureReservationsByCar[reservation.car_id] || [];
      futureReservationsByCar[reservation.car_id].push(reservation);
    });

    updateCarsAvailability();
  });
}


ReserveController.resolve = {
  dataCars: function(dataSource) {
    return dataSource.getAllCars();
  }
};
