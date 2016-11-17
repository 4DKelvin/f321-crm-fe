(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('settingProfile', settingProfile);
  /** @ngInject */
  function settingProfile(toastr, f321Api) {
    var vm = this;
    vm.info = {};
    vm.submit = function () {
      if (!vm.info.qq || !vm.info.realname || !vm.info.email || !vm.info.mobile) {
        toastr.warning('请输入正确的信息~', '警告');
      }
      //TODO:修改用户信息
    }

  }
})();
