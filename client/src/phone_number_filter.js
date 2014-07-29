module.exports = function phoneNumberFilterProvider() {
  var cache = {};

  return function phoneNumberFilter(number) {
    if (!number) {
      return '';
    }

    if (!cache[number]) {
      cache[number] = number.substr(4, 3) + ' ' + number.substr(7, 3) + ' ' + number.substr(10);
    }

    return cache[number];
  };
};
