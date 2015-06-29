function ExistingController($scope, reservations, authUser) {
  if (authUser.is_admin) {
    // Admin can see all pending reservations.
    // The contact is the dealer.
    reservations = reservations.map(function(reservation) {
      reservation.contact = reservation.user;
      return reservation;
    });
  } else {
    // Non-admin users (dealears) can only see their reservations.
    // The contact is the customer (the driver).
    reservations = reservations.filter(function(reservation) {
      return reservation.created_by === authUser.id;
    }).map(function(reservation) {
      reservation.contact = reservation.customer;
      return reservation;
    });
  }

  $scope.reservations = reservations.map(function(reservation) {
    var missing = [];
    if (!reservation.protocol_doc_returned) {
      missing.push('předávací protokol');
    }
    if (!reservation.survey_doc_returned) {
      missing.push('dotazník');
    }
    if (!reservation.tachometer_end) {
      missing.push('stav tachometru');
    }
    reservation.missing = missing.join(', ');

    reservation.showCompleteButton = reservation.created_by === authUser.id && !reservation.tachometer_end;
    reservation.showFinishButton = authUser.is_admin;

    return reservation;
  })

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
