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
      if (!vm.user.reportDt || !vm.user.jobDt || !vm.user.tel || !vm.user.dept || !vm.user.sex || !vm.user.realName || !vm.user.account || !vm.user.password ||
        vm.user.isAdmin < 0 ||
        vm.user.status < 0) {
        return toastr.error('请输入完整的信息', '提交失败');
      }
      f321Api.user$save(this.user).then(function (res) {
        toastr.success('操作成功', '出错');
        window.history.back();
      }, function (err) {
        toastr.error(err, '出错');
      })
    }
  };
})();
