(function () {
  'use strict';
  angular
    .module('f321CrmFe')
    .directive('aceNavbar', aceNavbar);
  document.createElement('ace-navbar');
  /** @ngInject */
  function aceNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {},
      /** @ngInject */
      controller: function ($state, $cookies,toastr) {
        var vm = this;
        vm.short = [
          {
            url: '#/client/new',
            name: '新录入新客户'
          }
        ];
        vm.logout = function () {
          $cookies.remove('profile');
          $cookies.remove('autoLogin');
          $state.go('login');
          return toastr.info('你已经安全退出', '操作成功');
        }
      },
      controllerAs: 'bar',
      bindToController: true
    };

    return directive;
  }

})();
