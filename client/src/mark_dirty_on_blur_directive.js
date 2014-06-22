module.exports = function markDirtyOnBlurDirectiveFactory() {
  return {
    require: 'ngModel',
    link: function markDirtyOnBlurLinkingFn(scope, elm, attr, ngModel) {
      elm.bind('blur', function() {
        if (ngModel.$dirty) {
          return;
        }

        scope.$apply(function() {
          // To be correct, we should also set $dirty on parent form and update ng-dirty/ng-pristine
          // classes, but we are not using it, so who cares.
          // Actuall, Angular should provide ngModel.$setDirty(), in the same way there is
          // ngModel.$setPristine().
          ngModel.$dirty = true;
          ngModel.$pristine = false;
        });
      });
    }
  }
}
