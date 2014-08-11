function LoginController($scope, $http, $location, loadingIndicator, authUser, focus, track) {

  $scope.email = '';
  $scope.password = '';
  $scope.maybeFirstTime = !authUser.token;

  $scope.submit = function() {
    loadingIndicator.show();

    $http.post('/auth/local', {email: $scope.email, password: $scope.password}).then(function(response) {
      authUser.update(response.data);
      $scope.$root.$broadcast('auth');
      track.login(authUser.id);
      track.user(authUser.id);
    }, function(err) {
      loadingIndicator.hide();
      track.loginFailed(err.data.code, $scope.email);

      if (err.data.code === 'invalid_email') {
        $scope.form.email.$setValidity('server', false);
        $scope.password = '';
        $scope.form.password.$setPristine();

        // When submit is triggered by entering inside the password input,
        // "blur" event can be triggered after this callback (if server response is fast enough).
        // This is a terrible hack to ignore mark-dirty-blur directive,
        // which would set the field back to dirty.
        $scope.form.password.__IGNORE_NEXT_BLUR = true;
        focus('#email-input');
      } else if (err.data.code === 'incorrect_password') {
        $scope.form.password.$setValidity('server', false);
        $scope.password = '';
        $scope.maybeFirstTime = false;
        focus('#password-input');
      }
    });
  };

  $scope.passwordChanged = function() {
    $scope.form.password.$setValidity('server', true);
  };

  $scope.emailChanged = function() {
    $scope.form.email.$setValidity('server', true);
  };
}

LoginController.$inject = ['$scope', '$http', '$location', 'loadingIndicator', 'authUser', 'focus', 'analytics'];

module.exports = LoginController;
