var fm = angular.module('fm', ['ngRoute', 'mgcrea.ngStrap.datepicker']);

fm.controller('App', AppController);
fm.service('dataSource', DataSource);
fm.service('loadingIndicator', LoadingIndicator);


fm.config(function($routeProvider, $datepickerProvider) {
  $routeProvider
    .when('/',         {templateUrl: './menu.html'})
    .when('/reserve',  {templateUrl: './reserve.html',  controller: ReserveController, resolve: ReserveController.resolve, title: 'Reserve Car'})
    .when('/reserve/:id/success',  {templateUrl: './reserve_success.html',  controller: ReserveSuccessController, resolve: ReserveSuccessController.resolve, title: 'Success'})
    .when('/existing', {templateUrl: './existing.html', controller: ExistingController, title: 'Existing Reservations'})

  angular.extend($datepickerProvider.defaults, {
    dateFormat: 'dd.MM.yyyy',
    autoclose: true,
    delay: {
      show: 0,
      hide: 0
    }
  });
});
