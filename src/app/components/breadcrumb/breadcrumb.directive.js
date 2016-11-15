(function () {
  'use strict';
  angular
    .module('f321CrmFe')
    .directive('aceBreadcrumb', aceBreadcrumb);
  document.createElement('ace-breadcrumb');
  /** @ngInject */
  function aceBreadcrumb($location, short_url) {
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
        vm.reload = function(){
          window.location.reload();
        };
        for (var i = 0; i < short_url.length; i++) {
          if ($location.$$url == short_url[i].url) {
            vm.links.push({
              name: short_url[i].group,
              icon: short_url[i].groupIco
            });
            vm.links.push({
              name: short_url[i].text,
              url: short_url[i].url
            });
          }
        }
      },
      controllerAs: 'breadcrumb',
      bindToController: true
    };

    return directive;
  }

})();
