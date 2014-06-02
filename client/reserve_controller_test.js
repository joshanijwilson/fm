describe('ReserveController', function() {

  describe('isCarAvailable', function() {

    var reservations = [
      {start: new Date(2014, 7, 1), end: new Date(2014, 7, 8)},
      {start: new Date(2014, 7, 15), end: new Date(2014, 7, 28)},
      {start: new Date(2014, 8, 21), end: new Date(2014, 8, 21)}
    ];

    it('should handle no reservation', function() {
      expect(isCarAvailable(null, new Date(2014, 7, 1), new Date(2014, 7, 2))).toBe(true);
    });


    it('should return true when before all reservations', function() {
      expect(isCarAvailable(reservations, new Date(2014, 1, 1), new Date(2014, 1, 2))).toBe(true);
      expect(isCarAvailable(reservations, new Date(2014, 6, 1), new Date(2014, 6, 2))).toBe(true);
    });

    it('should return false when conflicting a single day reservation', function() {
      expect(isCarAvailable(reservations, new Date(2014, 8, 21), new Date(2014, 8, 23))).toBe(false);
      expect(isCarAvailable(reservations, new Date(2014, 8, 20), new Date(2014, 8, 21))).toBe(false);
      expect(isCarAvailable(reservations, new Date(2014, 8, 21), new Date(2014, 8, 21))).toBe(false);
    });
  });
});
