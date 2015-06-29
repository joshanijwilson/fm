
function CarsController($scope, cars) {
  $scope.cars = cars;
}

CarsController.resolve = {
  dataCars: function(dataSource) {
    return dataSource.getAllCars();
  }
};


CarsController.$inject = ['$scope', 'dataCars'];
CarsController.resolve.dataCars.$inject = ['dataSource'];

module.exports = CarsController;
