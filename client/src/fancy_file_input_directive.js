module.exports = function fancyFileInputDirectiveFactory(FileUploader) {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      url: '='
    },
    link: {
      pre: function fancyFileInputLinkingFn($scope, elm, attr, ngModel) {
        $scope.isLoading = false;
        $scope.isLoaded = false;
        $scope.uploader = new FileUploader({
          url: '/storage/upload',
          autoUpload: true,
          onBeforeUploadItem: function() {
            $scope.isLoading = true;
          },
          onSuccessItem: function(item, response, status, headers) {
            $scope.url = headers['location'];
            $scope.isLoading = false;
            $scope.isLoaded = true;

            while ($scope.uploader.queue.length > 1) {
              $scope.uploader.removeFromQueue(0);
            }
          }
        });
      }
    },
    templateUrl: 'fancy_file_input.html'
  }
}

module.exports.$inject = ['FileUploader'];
