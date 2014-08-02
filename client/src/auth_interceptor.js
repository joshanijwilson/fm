module.exports = function AuthInterceptor(localStorage) {

  this.request = function(config) {
    var token = localStorage.get('token');

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }

    return config;
  };

  this.response = function(response) {
    return response;
  };
};

module.exports.$inject = ['localStorage'];
