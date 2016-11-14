(function() {
  'use strict';

  angular
    .module('f321CrmFe')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
