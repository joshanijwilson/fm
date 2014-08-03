function Focus($rootElement, $timeout) {
  return function focusElementService(selector) {
    $timeout(function focusElementTimeout() {
      $rootElement[0].querySelector(selector).focus();
    }, 0, false);
  };
}

Focus.$inject = ['$rootElement', '$timeout'];

module.exports = Focus;
