describe('ReserveController', function() {

  describe('isCarAvailable', function() {

    var reservations = [
      {start: new Date(2014, 7, 1), end: new Date(2014, 7, 8)},
      {start: new Date(2014, 7, 15), end: new Date(2014, 7, 28)}
    ];

    it('should handle no reservation', function() {
      expect(isCarAvailable(null, new Date(2014, 7, 1), new Date(2014, 7, 2))).toBe(true);
    });


    it('should return true when before all reservations', function() {
      expect(isCarAvailable(reservations, new Date(2014, 1, 1), new Date(2014, 1, 2))).toBe(true);
      expect(isCarAvailable(reservations, new Date(2014, 6, 1), new Date(2014, 6, 2))).toBe(true);
    });
  });
});
