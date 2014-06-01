var fm = angular.module('fm', ['ngRoute', 'mgcrea.ngStrap.datepicker']);

fm.controller('App', AppController);
fm.service('dataSource', DataSource);


fm.config(function($routeProvider, $datepickerProvider) {
  $routeProvider
    .when('/',         {templateUrl: './menu.html'})
    .when('/reserve',  {templateUrl: './reserve.html',  controller: ReserveController, resolve: ReserveController.resolve})
    .when('/existing', {templateUrl: './existing.html', controller: ExistingController})

  angular.extend($datepickerProvider.defaults, {
    dateFormat: 'dd.MM.yyyy',
    autoclose: true,
    delay: {
      show: 0,
      hide: 0
    }
  });
});
