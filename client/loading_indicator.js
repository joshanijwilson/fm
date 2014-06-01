function LoadingIndicator() {
  var backdrop = angular.element(document.getElementById('loader-indicator'));
  var body = angular.element(document.body);

  this.show = function() {
    backdrop.addClass('fade in');
    body.addClass('modal-open');
  };

  this.hide = function() {
    backdrop.removeClass('fade in');
    body.removeClass('modal-open');
  };
}
