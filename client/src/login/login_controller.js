function LoginController($scope, $http, $location, loadingIndicator, localStorage) {

  $scope.maybeFirstTime = !localStorage.get('token');

  $scope.submit = function() {
    loadingIndicator.show();

    $http.post('/auth/local', {email: $scope.email, password: $scope.password}).then(function(response) {
      localStorage.set('token', response.data.token);
      $location.path('/');
    }, function(err) {
      loadingIndicator.hide();
      console.log('FAILED TO LOGIN', err);
    });
  };
}

LoginController.$inject = ['$scope', '$http', '$location', 'loadingIndicator', 'localStorage'];

module.exports = LoginController;
