var ReserveController = require('../../src/reserve/reserve_controller');
var DataSource = require('../../src/data_source');
var mockResponses = require('../mock_responses');

var module = angular.mock.module;

// TODO(vojta): duplicate from data_service.js
var API_URL = '/api/v1/';

// TODO(vojta): duplicate from reserve_controller.js
function cloneDate(date) {
  return new Date(date);
}

describe('ReserveController', function() {

  describe('selectCar', function() {
    var scope;

    beforeEach(function() {
      module(function($provide) {
        $provide.service('dataSource', DataSource);
        $provide.value('dataCars', mockResponses.cars); // TODO(vojta): load from .resolve instead?
        $provide.value('loadingIndicator', null);
      });

      inject(function($injector, $rootScope, $httpBackend) {
        $httpBackend.whenGET(API_URL + 'reservations?start_gt=now').respond(mockResponses.reservations);
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
