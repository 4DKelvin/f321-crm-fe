(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('settingPassword', settingPassword);
  /** @ngInject */
  function settingPassword($cookies, toastr, f321Api) {
    var vm = this;
    vm.profile = $.parseJSON($cookies.get('profile'));
    vm.params = {};
    vm.submit = function () {
      if (!vm.params.password || !vm.params.new || !vm.params.confirm) {
        return toastr.warning('请输入正确的信息~', '警告');
      }
      if (vm.params.new != vm.params.confirm) {
        return toastr.warning('两次密码输入不一致~', '警告');
      }
      //TODO:修改密码
      f321Api.user$password(vm.params.password, vm.params.new).then(function (res) {
        return toastr.success('修改成功~', '操作成功');
      }, function (err) {
        return toastr.error(err, '出错');
      })
    }
  }
})();
