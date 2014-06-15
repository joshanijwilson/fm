function isCarAvailable(reservations, startDate, endDate) {
  if (!reservations || !reservations.length) {
    return true;
  }

  for (var i = 0; i < reservations.length; i++) {
    if (reservations[i].end < startDate) {
      // This reservation is before the requested interval.
      continue;
    }

    if (endDate < reservations[i].start) {
      // This reservation is after the requested interval.
      // Because the reservations are sorted, we can end the loop.
      return true;
    }

    return false;
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
  return 0;
}

function byStart(a, b) {
  if (a.start < b.start) return -1;
  if (a.start > b.start) return 1;
  return 0;
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

var ONE_DAY = 1000 * 60 * 60 * 24;

function findAvailableDateAfter(date, reservations) {
  // Skip all the reservations that happened before current start date to find the blocking one.
  var idx = 0;
  while (reservations[idx] && reservations[idx].end < date) {
    idx++;
  }

  // Skip all the reservations immediately afterwards (when there is no empty day between them).
  while (reservations[idx + 1] && reservations[idx].end.getTime() + ONE_DAY === reservations[idx + 1].start.getTime()) {
    idx++;
  }

  return new Date(reservations[idx].end.getTime() + ONE_DAY);
};


function ReserveController($scope, $location, dataSource, dataCars, loadingIndicator) {
  var allCarOptions = dataCars;
  var allModelOptions = [{id: null, name: 'Zobrazit všechny modely'}].concat(filterCarModelsFromCars(dataCars));
  var futureReservationsByCar = {};

  $scope.selectCar = function(car) {
    var reservationsForSelectedCar = futureReservationsByCar[car.id];

    $scope.selectedCar = car;
    $scope.unavailableDates = reservationsForSelectedCar;

    if (!car.available) {
      $scope.startDate = findAvailableDateAfter($scope.startDate, reservationsForSelectedCar);
      $scope.endDate = cloneDate($scope.startDate);

      updateCarsAvailability();
    }
  };

  $scope.pictureFor = function(modelName) {
    return modelName.toLowerCase().replace(/\s/g, '_') + '_600.jpg';
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
    }, function() {
      alert('ERROR');
      loadingIndicator.hide();
    });
  };

  $scope.isValid = function() {
    return $scope.form.$valid && $scope.selectedCar  && $scope.selectedCar.available;
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
    console.time('updateCarsAvailability');
    angular.forEach(allCarOptions, function(car) {
      car.available = isCarAvailable(futureReservationsByCar[car.id], $scope.startDate, $scope.endDate);
    });
    console.timeEnd('updateCarsAvailability');
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
  $scope.unavailableDates = null;
  $scope.customer = null;
  $scope.reasonOptions = REASON_OPTIONS;
  $scope.selectedReason = REASON_OPTIONS[0];

  updateCarsAvailability();

  dataSource.getAllFutureReservations().then(function(reservations) {
    reservations.forEach(function(reservation) {
      futureReservationsByCar[reservation.car_id] = futureReservationsByCar[reservation.car_id] || [];
      futureReservationsByCar[reservation.car_id].push(reservation);
    });

    // Sort reservations by start date (bs-datepicker expects sorted ranges).
    angular.forEach(futureReservationsByCar, function(reservations, carId) {
      reservations.sort(byStart);
    });

    updateCarsAvailability();
  });
}

ReserveController.resolve = {
  dataCars: function(dataSource) {
    return dataSource.getAllCars();
  }
};


ReserveController.$inject = ['$scope', '$location', 'dataSource', 'dataCars', 'loadingIndicator'];
ReserveController.resolve.dataCars.$inject = ['dataSource'];

module.exports = ReserveController;
