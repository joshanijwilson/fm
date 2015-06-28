function ExistingController($scope, reservations, authUser) {
  if (authUser.is_admin) {
    // Admin can see all pending reservations.
    // The contact is the dealer.
    $scope.reservations = reservations.map(function(reservation) {
      reservation.contact = reservation.user;
      return reservation;
    });
    $scope.showFinish = true;
  } else {
    // Non-admin users (dealears) can only see their reservations.
    // The contact is the customer (the driver).
    $scope.reservations = reservations.filter(function(reservation) {
      return reservation.created_by === authUser.id;
    }).map(function(reservation) {
      reservation.contact = reservation.customer;
      return reservation;
    });
    $scope.showFinish = false;
  }

  $scope.formatName = function(contact) {
    if (contact.dealership_name) {
      return contact.first_name + ' ' + contact.last_name + ' (' + contact.dealership_name + ')';
    }

    return contact.first_name + ' ' + contact.last_name;
  };
}

ExistingController.resolve = {
  dataReservations: function(dataSource) {
    return dataSource.getAllReservations();
  }
};


ExistingController.$inject = ['$scope', 'dataReservations', 'authUser'];
ExistingController.resolve.dataReservations.$inject = ['dataSource'];

module.exports = ExistingController;
