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


function DataSource($http) {

  this.getAllFutureReservations = function() {
    return $http.get(API_URL + 'reservations?start_gt=now').then(dataFromResponse).then(function(reservations) {
      reservations.forEach(function(reservation) {
        reservation.start = parseDate(reservation.start);
        reservation.end = parseDate(reservation.end);
      });
      return reservations;
    });
  };

  this.createReservation = function(reservation) {
    reservation.start = formatDateToString(reservation.start);
    reservation.end = formatDateToString(reservation.end);

    return $http.post(API_URL + 'reservations', reservation).then(dataFromResponse);
  };

  this.deleteReservation = function(id) {
    return $http.delete(API_URL + 'reservations/' + id).then(dataFromResponse);
  };

  this.getReservation = function(id) {
    return $http.get(API_URL + 'reservations/' + id).then(dataFromResponse).then(function(reservation) {
      reservation.start = parseDate(reservation.start);
      reservation.end = parseDate(reservation.end);

      return reservation;
    });
  };

  this.getAllCars = function() {
    return $http.get(API_URL + 'cars').then(dataFromResponse).then(function(cars) {
      cars.forEach(function(car) {
        car.equipment = CAR_EQUIPMENT[car.equipment];
        car.transmission = CAR_TRANSMISSION[car.transmission];
      });

      return cars;
    });
  };
};

DataSource.$inject = ['$http'];

module.exports = DataSource;
