var base64 = window.btoa;

function AuthUser(localStorage) {

  this.loadFromLocalStorage = function() {
    angular.extend(this, localStorage.get('auth_user'));
    this.urlToken = btoa(this.token);
  };

  this.update = function(user) {
    angular.extend(this, user);
    this.urlToken = btoa(this.token);
    localStorage.set('auth_user', user);
  };

  this.loadFromLocalStorage();

  // TODO(vojta): Remove once we know that all users are fine.
  // During the change from localStorage.token -> localStorage.auth_user,
  // some clients can possibly have invalid value in their localStorage.
  // This forces login.
  if (this.token && !this.id) {
    this.token = null;
  }
};

AuthUser.$inject = ['localStorage'];

module.exports = AuthUser;
