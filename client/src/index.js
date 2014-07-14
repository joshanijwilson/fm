var deps = ['ngRoute', 'ngTouch', 'mgcrea.ngStrap.datepicker'];

if (window.FM_BUNDLED) {
  deps.push('fm.templates');
}

angular.module('fm', deps)
  .controller('App',              require('./app_controller'))
  .service(   'dataSource',       require('./data_source'))
  .service(   'loadingIndicator', require('./loading_indicator'))
  .config(                        require('./configure'))
  .directive('isVisible',         require('./is_visible_directive'))
  .directive('markDirtyOnBlur',   require('./mark_dirty_on_blur_directive'))
  .directive('errorClassFor',     require('./error_class_for_directive'))
  .directive('phoneValidator',    require('./phone_validator_directive'))
  .filter('phoneNumber',          require('./phone_number_filter'))
;

angular.bootstrap(document, ['fm']);
