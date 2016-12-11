(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('adminNew', adminNew);
  /** @ngInject */
  function adminNew(toastr, f321Api, $stateParams, $state) {
    var vm = this;
    vm.user = $stateParams.user;
    vm.title = vm.user ? '编辑用户' : '添加用户';
    vm.save = function () {
      f321Api.user$save(this.user).then(function (res) {
        toastr.success('操作成功', '出错');
        window.history.back();
      }, function (err) {
        toastr.error(err, '出错');
      })
    }
  };
})();
