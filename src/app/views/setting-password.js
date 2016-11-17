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
        toastr.warning('请输入正确的信息~', '警告');
      }
      if (vm.params.new != vm.params.confirm) {
        toastr.warning('两次密码输入不一致~', '警告');
      }
      //TODO:修改密码
    }
  }
})();
