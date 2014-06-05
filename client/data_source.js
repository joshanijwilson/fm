var API_URL = '/api/v1/';

function dataFromResponse(response) {
  return response.data;
}


// copy-pasted from server, might be shared
function formatDateToString(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function DataSource($http) {

  this.getAllFutureReservations = function() {
    return $http.get(API_URL + 'reservations?start_gt=now').then(dataFromResponse).then(function(reservations) {
      reservations.forEach(function(reservation) {
        reservation.start = new Date(reservation.start);
        reservation.end = new Date(reservation.end);
      });
      return reservations;
    });
  };

  this.createReservation = function(reservation) {
    reservation.start = formatDateToString(reservation.start);
    reservation.end = formatDateToString(reservation.end);

    return $http.post(API_URL + 'reservations', reservation).then(dataFromResponse);
  };

  this.getReservation = function(id) {
    return $http.get(API_URL + 'reservations/' + id).then(dataFromResponse).then(function(reservation) {
      reservation.start = new Date(reservation.start);
      reservation.end = new Date(reservation.end);

      return reservation;
    });
  };

  this.getAllCars = function() {
    return $http.get(API_URL + 'cars').then(dataFromResponse);
  };
}
