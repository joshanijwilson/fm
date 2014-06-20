var ReserveController        = require('./reserve/reserve_controller');
var ReserveSuccessController = require('./reserve/reserve_success_controller');
var ExistingController       = require('./existing/existing_controller');

function configure($routeProvider, $datepickerProvider) {
  $routeProvider
    .when('/',         {templateUrl: 'menu.html'})
    .when('/reserve',  {templateUrl: 'reserve/reserve.html',  controller: ReserveController, resolve: ReserveController.resolve, title: 'Rezervace'})
    .when('/reserve/:id/success',  {templateUrl: 'reserve/reserve_success.html',  controller: ReserveSuccessController, resolve: ReserveSuccessController.resolve, title: 'Úspěšně zarezervováno'})
    .when('/reserve/:id/canceled',  {templateUrl: 'reserve/reserve_canceled.html',  title: 'Rezervace zrušena'})
    .when('/existing', {templateUrl: 'existing/existing.html', controller: ExistingController, title: 'Stávající rezervace'})

  angular.extend($datepickerProvider.defaults, {
    dateFormat: 'dd.MM.yyyy',
    autoclose: true,
    delay: {
      show: 0,
      hide: 0
    }
  });
}

configure.$inject = ['$routeProvider', '$datepickerProvider'];

module.exports = configure;
