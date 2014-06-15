var deps = ['ngRoute', 'ngTouch', 'mgcrea.ngStrap.datepicker'];

if (window.FM_BUNDLED) {
  deps.push('fm.templates');
}

angular.module('fm', deps)
  .controller('App',              require('./app_controller'))
  .service(   'dataSource',       require('./data_source'))
  .service(   'loadingIndicator', require('./loading_indicator'))
  .config(                        require('./configure'))
;

angular.bootstrap(document, ['fm']);
