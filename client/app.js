var fm = angular.module('fm', ['ngRoute', 'ngTouch', 'mgcrea.ngStrap.datepicker']);

fm.controller('App', AppController);
fm.service('dataSource', DataSource);
fm.service('loadingIndicator', LoadingIndicator);
fm.config(configure);
