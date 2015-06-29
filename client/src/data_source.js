var API_URL = '/api/v1/';

var CAR_EQUIPMENT = {
  1: 'Kinetic',
  2: 'Momentum',
  3: 'Summum',
  4: 'R-Design'
};

var CAR_TRANSMISSION = {
  'AUTO': 'automat',
  'MANUAL': 'manuál'
};


function dataFromResponse(response) {
  return response.data;
}

function parseDate(string) {
  return new Date(string.replace(/-/g, '/'));
}

// copy-pasted from server, might be shared
function formatDateToString(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function findById(collection, id) {
  for (var i = 0, ii = collection.length; i < ii; i++) {
    if (collection[i].id === id) return collection[i];
  }
  return null;
}

function deserializeReservation(reservation) {
  reservation.start = parseDate(reservation.start);
  reservation.end = parseDate(reservation.end);
  return reservation;
}

function deserializeReservations(reservations) {
  return reservations.map(deserializeReservation);
}


function DataSource($http) {

  this.getAllReservations = function() {
    return $http.get(API_URL + 'reservations?finished_at=null').then(dataFromResponse).then(deserializeReservations);
  };

  this.getAllFutureReservations = function() {
    var now = new Date();

    return this.getAllReservations().then(function(reservations) {
      return reservations.filter(function(reservation) {
        return reservation.end > now;
      });
    });
  };

  this.getReservationsByCarId = function(id) {
    return $http.get(API_URL + 'reservations?car_id=' + id).then(dataFromResponse).then(deserializeReservations);
  }

  this.createReservation = function(reservation) {
    reservation.start = formatDateToString(reservation.start);
    reservation.end = formatDateToString(reservation.end);

    return $http.post(API_URL + 'reservations', reservation).then(dataFromResponse);
  };

  this.updateReservation = function(reservation) {
    return $http.put(API_URL + 'reservations/' + reservation.id, reservation).then(dataFromResponse);
  };

  this.deleteReservation = function(id) {
    return $http.delete(API_URL + 'reservations/' + id).then(dataFromResponse);
  };

  this.getReservation = function(id) {
    return $http.get(API_URL + 'reservations/' + id).then(dataFromResponse).then(deserializeReservation);
  };

  this.getAllCars = function() {
    return $http.get(API_URL + 'cars', {cache: true}).then(dataFromResponse).then(function(cars) {
      cars.forEach(function(car) {
        car.equipment = CAR_EQUIPMENT[car.equipment];
        car.transmission = CAR_TRANSMISSION[car.transmission];
      });

      return cars;
    });
  };

  this.getCarById = function(id) {
    return this.getAllCars().then(function(cars) {
      return findById(cars, id);
    });
  };
};

DataSource.$inject = ['$http'];

module.exports = DataSource;
