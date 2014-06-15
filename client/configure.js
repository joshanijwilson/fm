var ReserveController        = require('./reserve_controller');
var ReserveSuccessController = require('./reserve_success_controller');
var ExistingController       = require('./existing_controller');

function configure($routeProvider, $datepickerProvider) {
  $routeProvider
    .when('/',         {templateUrl: 'menu.html'})
    .when('/reserve',  {templateUrl: 'reserve.html',  controller: ReserveController, resolve: ReserveController.resolve, title: 'Rezervace'})
    .when('/reserve/:id/success',  {templateUrl: 'reserve_success.html',  controller: ReserveSuccessController, resolve: ReserveSuccessController.resolve, title: 'Úspěšně zarezervováno'})
    .when('/existing', {templateUrl: 'existing.html', controller: ExistingController, title: 'Stávající rezervace'})

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
