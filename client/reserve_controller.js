function ReserveController($scope) {
  $scope.modelOptions = [
    {id: 1, name: 'S60', available: true},
    {id: 2, name: 'S80', available: true},
    {id: 3, name: 'V40', available: false},
    {id: 4, name: 'V60', available: true},
    {id: 5, name: 'V70', available: true},
    {id: 6, name: 'XC60', available: true}
  ];

  $scope.carOptions = [
    {id: 1, model: 'S80', description: 'T6 AWD 304k', color: 'black'},
    {id: 2, model: 'S60', description: 'T6 AWD 304k', color: 'red'},
    {id: 3, model: 'S60', description: 'D3 136k',     color: 'blue'},
    {id: 4, model: 'V60', description: 'D3 136k',     color: 'blue'},
    {id: 5, model: 'XC60', description: 'T6 306k',    color: 'white'}
  ];

  $scope.selectCar = function(car) {
    $scope.selectedCar = car;
  };

  $scope.selectedModel = null;
  $scope.selectedCar = null;
  $scope.start = null;
  $scope.end = null;
  $scope.customer = null;
  $scope.reason = null;
}
