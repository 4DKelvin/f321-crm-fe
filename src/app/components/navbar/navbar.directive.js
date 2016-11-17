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
        vm.messages = [
          {
            type: 'pink',
            icon: 'lock',
            text: '密码安全等级太低，请及时设置！',
            url: '#/'
          },
          {
            type: 'success',
            icon: 'user',
            text: '个人资料不够完善，请及时完善！',
            url: '#/'
          }
        ];
        vm.short = [
          {
            url: '#/',
            name: '我的约会'
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
