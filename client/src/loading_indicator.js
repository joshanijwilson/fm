function LoadingIndicator() {
  var backdrop = angular.element(document.getElementById('loader-indicator'));
  var body = angular.element(document.body);
  var currentlyShown = false;

  this.show = function() {
    if (currentlyShown) {
      return;
    }

    backdrop.addClass('fade in');
    body.addClass('modal-open');
    currentlyShown = true;
  };

  this.hide = function() {
    if (!currentlyShown) {
      return;
    }

    backdrop.removeClass('fade in');
    body.removeClass('modal-open');
    currentlyShown = false;
  };
}

LoadingIndicator.$inject = [];

module.exports = LoadingIndicator;
