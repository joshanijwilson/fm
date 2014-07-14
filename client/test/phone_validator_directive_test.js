var phoneValidatorDirective = require('../src/phone_validator_directive');

describe('phone validator', function() {
  var validate = phoneValidatorDirective.validatePhoneNumber;
  var normalize = phoneValidatorDirective.normalizePhoneNumber;
  var normalizeAndValidate = function(value) {
    return validate(normalize(value));
  };

  it('should not allow letters', function() {
    expect(normalizeAndValidate('605abs54')).toBe(false);
  });

  it('should allow ()-', function() {
    expect(normalizeAndValidate('(408)658-6582')).toBe(true);
  });

  it('should allow spaces', function() {
    expect(normalizeAndValidate('543 554 5434')).toBe(true);
  });

  it('should allow +420 at the beginning', function() {
    expect(normalizeAndValidate('+420605776778')).toBe(true);
  });

  it('should not allow + other than very beginning', function() {
    expect(normalizeAndValidate('543+234')).toBe(false);
  });

  it('should not allow more than 13 digits', function() {
    expect(normalizeAndValidate('+12345678901234')).toBe(false);
  });

  it('should allow 13 digits', function() {
    expect(normalizeAndValidate('+1 (234) 567-890123')).toBe(true);
  });

  describe('normalize', function() {
    it('should remove ()- and spaces', function() {
      expect(normalize('+1 (408) 658-1123')).toBe('+14086581123');
    });

    it('should prefix with +420 if + missing', function() {
      expect(normalize('605432445')).toBe('+420605432445');
    });
  });
});
