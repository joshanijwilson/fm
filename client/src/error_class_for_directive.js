module.exports = function errorClassForDirectiveFactory() {
  return function errorClassForLinkingFn(scope, elm, attr) {
    scope.$watch(attr.errorClassFor + '.$dirty && ' + attr.errorClassFor + '.$invalid', function(invalid) {
      if (invalid) {
        elm.addClass('has-error');
      } else {
        elm.removeClass('has-error');
      }
    });
  };
};
