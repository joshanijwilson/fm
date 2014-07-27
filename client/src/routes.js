var ReserveController        = require('./reserve/reserve_controller');
var ReserveSuccessController = require('./reserve/reserve_success_controller');
var ExistingController       = require('./existing/existing_controller');
var FinishController         = require('./finish/finish_controller');
var FinishSuccessController  = require('./finish/finish_success_controller');

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
    title: 'Úspěšně Zarezervováno',
    templateUrl: 'reserve/reserve_success.html',
    controller: ReserveSuccessController,
    showMenuButton: false
  },

  '/reserve/:id/canceled': {
    title: 'Rezervace Zrušena',
    templateUrl: 'reserve/reserve_canceled.html',
    showMenuButton: false
  },

  '/existing': {
    title: 'Stávající Rezervace',
    templateUrl: 'existing/existing.html',
    controller: ExistingController
  },

  '/finish/:id': {
    title: 'Ukončit rezervaci',
    templateUrl: 'finish/finish.html',
    controller: FinishController
  },

  '/finish/:id/success': {
    title: 'Rezervace ukončena',
    templateUrl: 'finish/finish_success.html',
    controller: FinishSuccessController
  }
};
