var DEFAULT_PAGE_TITLE = 'FleetManager';

function PageTitle($rootScope) {
  function setPageTitle(title) {
    $rootScope.pageTitle = title ? DEFAULT_PAGE_TITLE + ': ' + title : DEFAULT_PAGE_TITLE;
    $rootScope.pageHeader = title || DEFAULT_PAGE_TITLE;
  }

  setPageTitle.defaultTitle = function() {
    return setPageTitle(null);
  };

  return setPageTitle;
}

PageTitle.$inject = ['$rootScope'];

module.exports = PageTitle;
