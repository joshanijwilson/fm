function validatePhoneNumber(number) {
  return /^\+\d*$/.test(number) && number.length <= 14;
}

var DEFAULT_COUNTRY_PREFIX = '+420';

// Remove spaces, ()- and prefix +420 if does not start with +.
function normalizePhoneNumber(number) {
  number = number.replace(/[\s\-\(\)]+/g, '');

  if (number[0] !== '+') {
    number = DEFAULT_COUNTRY_PREFIX + number;
  }

  return number;
}

module.exports = function phoneValidatorDirectiveFactory() {
  return {
    require: 'ngModel',
    link: function phoneValidatorLinkingFn(scope, elm, attr, ngModel) {
      ngModel.$parsers.push(function phoneValidator(value) {
        if (!value) {
          return value;
        }

        value = normalizePhoneNumber(value);
        ngModel.$setValidity('phone', validatePhoneNumber(value));

        return value;
      });
    }
  };
};

// Export for testing.
// TODO(vojta): move these functions into "model" (shared between client/server).
module.exports.validatePhoneNumber = validatePhoneNumber;
module.exports.normalizePhoneNumber = normalizePhoneNumber;
