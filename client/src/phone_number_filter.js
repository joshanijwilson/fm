module.exports = function phoneNumberFilterProvider() {
  var cache = {};

  return function phoneNumberFilter(number) {
    if (!number) {
      return '';
    }

    if (!cache[number]) {
      cache[number] = number.substr(0, 3) + ' ' + number.substr(3, 3) + ' ' + number.substr(6);
    }

    return cache[number];
  };
};
