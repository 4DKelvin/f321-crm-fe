(function () {
  'use strict';
  angular
    .module('f321CrmFe')
    .directive('aceBreadcrumb', aceBreadcrumb);
  document.createElement('ace-breadcrumb');
  /** @ngInject */
  function aceBreadcrumb($state, short_url, common_url) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/breadcrumb/breadcrumb.html',
      scope: {},
      /** @ngInject */
      controller: function () {
        var vm = this;
        vm.links = [{
          name: '首页',
          icon: 'icon-home',
          url: '/'
        }];
        vm.reload = function () {
          window.location.reload();
        };
        var arr = short_url.concat(common_url);
        for (var i = 0; i < arr.length; i++) {
          if ($state.current.key == arr[i].key) {
            if (arr[i].group) {
              vm.links.push({
                name: arr[i].group,
                icon: arr[i].groupIco
              });
            }
            if (arr[i].text) {
              vm.links.push({
                name: arr[i].text,
                url: arr[i].url
              });
            }
          }
        }
      },
      controllerAs: 'breadcrumb',
      bindToController: true
    };

    return directive;
  }

})();
