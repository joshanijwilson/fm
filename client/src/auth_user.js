function AuthUser(localStorage) {

  this.loadFromLocalStorage = function() {
    angular.extend(this, localStorage.get('auth_user'));
  };

  this.update = function(user) {
    angular.extend(this, user);
    localStorage.set('auth_user', user);
  };

  this.loadFromLocalStorage();
};

AuthUser.$inject = ['localStorage'];

module.exports = AuthUser;
