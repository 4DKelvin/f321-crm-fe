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
      controller: function ($state, $cookies, toastr, f321Api) {
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
        };
        vm.params = {
          crmContactList: []
        };
        vm.addContact = function () {
          vm.params.crmContactList.push({
            name: '',
            sex: '',
            mobile: '',
            tel: '',
            dept: '',
            email: '',
            fax: '',
            isPrimary: false
          });
        };
        vm.remove = function (contact) {
          vm.params.crmContactList.splice(vm.params.crmContactList.indexOf(contact), 1);
        };
        vm.submit = function () {
          f321Api.customer$save(vm.params).then(function () {
            toastr.success('添加客户信息成功~', '操作成功');
            $state.go(-1);
          }, function (err) {
            toastr.error(err, '出错');
          });
        };
      },
      controllerAs: 'bar',
      bindToController: true
    };

    return directive;
  }

})();
