var isCarAvailable = require('./utils').isCarAvailable;
var ReserveController = require('./reserve_controller');
var DataSource = require('./data_source');

var module = angular.mock.module;

// TODO(vojta): duplicate from data_service.js
var API_URL = '/api/v1/';

// TODO(vojta): duplicate from reserve_controller.js
function cloneDate(date) {
  return new Date(date);
}

var MOCK_CARS = [
   {
      "id":10,
      "vin":"0",
      "spz":"2SV4407",
      "model_id":152,
      "model_year":2014,
      "name":"V40 D2 CROSS COUNTRY",
      "engine_displacement":0,
      "transmission":"MANUAL",
      "color":"",
      "equipment":3,
      "model_name":"V40 CC"
   },
   {
      "id":9,
      "vin":"0",
      "spz":"3SA9637",
      "model_id":153,
      "model_year":2014,
      "name":"S80 D5 AWD",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"S80"
   },
   {
      "id":11,
      "vin":"0",
      "spz":"2SY1290",
      "model_id":154,
      "model_year":2014,
      "name":"V60 D4 DRIVE -E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"V60"
   },
   {
      "id":12,
      "vin":"0",
      "spz":"3SA8339",
      "model_id":155,
      "model_year":2014,
      "name":"S60 D4 DRIVE -E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"S60"
   },
   {
      "id":8,
      "vin":"0",
      "spz":"3SD3488",
      "model_id":156,
      "model_year":2014,
      "name":"XC70 D4 DRIVE -E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"XC70"
   },
   {
      "id":13,
      "vin":"0",
      "spz":"2SY1661",
      "model_id":156,
      "model_year":2014,
      "name":"XC70 D5 AWD",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"XC70"
   },
   {
      "id":14,
      "vin":"0",
      "spz":"XXXXXXX",
      "model_id":157,
      "model_year":2014,
      "name":"XC60 D4 DRIVE - E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"XC60"
   }
];


var MOCK_RESERVATIONS = [
   {
      "id":60,
      "customer_id":44,
      "car_id":10,
      "start":"2014-6-7",
      "end":"2014-6-24",
      "reason":1,
      "note":null,
      "created_at":"2014-06-07T16:07:19.000Z",
      "created_by":1,
      "updated_at":"2014-06-07T16:07:19.000Z"
   },
   {
      "id":61,
      "customer_id":44,
      "car_id":9,
      "start":"2014-6-7",
      "end":"2014-6-24",
      "reason":1,
      "note":null,
      "created_at":"2014-06-07T16:07:19.000Z",
      "created_by":1,
      "updated_at":"2014-06-07T16:07:19.000Z"
   },
   {
      "id":62,
      "customer_id":44,
      "car_id":9,
      "start":"2014-6-25",
      "end":"2014-6-26",
      "reason":1,
      "note":null,
      "created_at":"2014-06-07T16:07:19.000Z",
      "created_by":1,
      "updated_at":"2014-06-07T16:07:19.000Z"
   }
];

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


  describe('selectCar', function() {
    var scope;

    beforeEach(function() {
      module(function($provide) {
        $provide.service('dataSource', DataSource);
        $provide.value('dataCars', MOCK_CARS); // TODO(vojta): load from .resolve instead?
        $provide.value('loadingIndicator', null);
      });

      inject(function($injector, $rootScope, $httpBackend) {
        $httpBackend.whenGET(API_URL + 'reservations?start_gt=now').respond(MOCK_RESERVATIONS);
        scope = $rootScope;
        $injector.instantiate(ReserveController, {$scope: scope});

        // Resolve the getAllFutureReservations promise.
        $httpBackend.flush();
        scope.$apply();
      });
    });


    it('should not change dates when the car is available', function() {
      var originalStartDate = cloneDate(scope.startDate);
      var originalEndDate = cloneDate(scope.endDate);

      scope.$apply(function() {
        scope.selectCar(scope.carOptions[2]);
      });

      expect(scope.startDate).toEqual(originalStartDate);
      expect(scope.endDate).toEqual(originalEndDate);
    });


    it('should find first available date', function() {
      scope.startDate = new Date('2014-6-7');
      scope.endDate = new Date('2014-6-7');

      // Select a car that is reserved 2014-6-7 to 2014-6-24
      scope.$apply(function() {
        scope.selectCar(scope.carOptions[0]);
      });

      expect(scope.startDate).toEqual(new Date('2014-6-25'));
      expect(scope.endDate).toEqual(new Date('2014-6-25'));
    });


    it('should update availability of cars (based on the new date)', function() {
      scope.startDate = new Date('2014-6-7');
      scope.endDate = new Date('2014-6-7');

      // Select a car that is reserved 2014-6-7 to 2014-6-24
      scope.$apply(function() {
        scope.selectCar(scope.carOptions[0]);
      });

      expect(scope.selectedCar.available).toBe(true);
    });


    it('should find first available date (multiple reservations for car)', function() {
      scope.startDate = new Date('2014-6-7');
      scope.endDate = new Date('2014-6-7');

      // There are two reservations for this car:
      // - 2014-6-7  -> 2014-6-24
      // - 2014-6-25 -> 2014-6-26
      scope.$apply(function() {
        scope.selectCar(scope.carOptions[1]);
      });

      expect(scope.startDate).toEqual(new Date('2014-6-27'));
      expect(scope.endDate).toEqual(new Date('2014-6-27'));
    });

  });

});
