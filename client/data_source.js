var API_URL = '/api/v1/';

function dataFromResponse(response) {
  return response.data;
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

  this.getAllCars = function() {
    return $http.get(API_URL + 'cars').then(dataFromResponse);
  };
}
