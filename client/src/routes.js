var ReserveController        = require('./reserve/reserve_controller');
var ReserveSuccessController = require('./reserve/reserve_success_controller');
var ExistingController       = require('./existing/existing_controller');

module.exports = {
  '/': {
    templateUrl: 'menu.html', showMenuButton: false
  },

  '/reserve': {
    title: 'Rezervace',
    templateUrl: 'reserve/reserve.html',
    controller: ReserveController
  },

  '/reserve/:id/success': {
    title: 'Úspěšně zarezervováno',
    templateUrl: 'reserve/reserve_success.html',
    controller: ReserveSuccessController,
    showMenuButton: false
  },

  '/reserve/:id/canceled': {
    title: 'Rezervace zrušena',
    templateUrl: 'reserve/reserve_canceled.html',
    showMenuButton: false
  },

  '/existing': {
    title: 'Stávající rezervace',
    templateUrl: 'existing/existing.html',
    controller: ExistingController
  }
};
