var fm = angular.module('fm', ['ngRoute']);

fm.controller('App', AppController);


// Routing
fm.config(function($routeProvider) {
  $routeProvider
    .when('/',         {templateUrl: './menu.html'})
    .when('/reserve',  {templateUrl: './reserve.html',  controller: ReserveController})
    .when('/existing', {templateUrl: './existing.html', controller: ExistingController})

});
