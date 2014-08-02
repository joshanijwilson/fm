var storage = window.localStorage;

module.exports = function LocalStorage() {
  this.get = function(key) {
    return JSON.parse(storage.getItem(key));
  };

  this.set = function(key, value) {
    storage.setItem(key, JSON.stringify(value));
  };
};
