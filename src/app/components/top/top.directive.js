(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .directive('aceTop', aceTop);

  document.createElement('ace-top');

  /** @ngInject */
  function aceTop() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/top/top.html',
      scope: {
        mini: '=?'
      },
      /** @ngInject */
      controller: function () {
        var vm = this;
        vm.press = function () {
          $(document).scrollTop(0);
        }
      },
      controllerAs: 'top',
      bindToController: true
    };

    return directive;
  }

})();
