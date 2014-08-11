var deps = ['ngRoute', 'ngTouch', 'mgcrea.ngStrap.datepicker', 'angularFileUpload', 'ui.bootstrap-slider'];

if (window.FM_BUNDLED) {
  deps.push('fm.templates');
}

angular.module('fm', deps)
  .controller('App',              require('./app_controller'))
  .service(   'dataSource',       require('./data_source'))
  .service(   'loadingIndicator', require('./loading_indicator'))
  .service('authInterceptor',     require('./auth_interceptor'))
  .service('localStorage',        require('./local_storage'))
  .service('focus',               require('./focus'))
  .service('authUser',            require('./auth_user'))
  .service('analytics',           require('./analytics'))
  .config(                        require('./configure'))
  .directive('isVisible',         require('./is_visible_directive'))
  .directive('markDirtyOnBlur',   require('./mark_dirty_on_blur_directive'))
  .directive('errorClassFor',     require('./error_class_for_directive'))
  .directive('phoneValidator',    require('./phone_validator_directive'))
  .directive('fancyFileInput',    require('./fancy_file_input_directive'))
  .filter('phoneNumber',          require('./phone_number_filter'))
;

angular.bootstrap(document, ['fm']);
