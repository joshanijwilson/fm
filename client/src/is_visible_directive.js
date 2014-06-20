module.exports = function isVisibleDirectiveFactory() {
  return function isVisibleLinkingFn(scope, elm, attr) {
    scope.$watch(attr.isVisible, function(isVisible, previousIsVisible) {
      if (isVisible === previousIsVisible) {
        return;
      }
      console.log('visibility', isVisible ? 'visible' : 'hidden')
      elm.css('visibility', isVisible ? 'visible' : 'hidden');
    });
  };
};
