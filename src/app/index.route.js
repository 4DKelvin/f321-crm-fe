(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, short_url, common_url) {

    short_url.concat(common_url).forEach(function (state) {
      $stateProvider.state(state.key, state);
    });
    $urlRouterProvider.otherwise(common_url[0].url);
  };
})();
