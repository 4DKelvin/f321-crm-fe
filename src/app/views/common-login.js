(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('login', login);
  /** @ngInject */
  function login($state, f321Api, $cookies, toastr) {
    var vm = this;
    vm.autoLogin = false;
    vm.submit = function () {
      if (!vm.account || !vm.password) {
        return toastr.warning('请输入你的账号和密码', '警告');
      }
      f321Api.login(vm.account, vm.password).then(function (res) {
        $cookies.set('profile', JSON.stringify(res));
        if (vm.autoLogin) {
          $cookies.set('autoLogin', vm.autoLogin);
        } else {
          $cookies.remove('autoLogin');
        }
        toastr.success('登录成功~', '操作成功');
        $state.go('home');
      }, function (err) {
        toastr.error(err, '操作失败');
      })
    };
  }
})();
