(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('settingProfile', settingProfile);
  /** @ngInject */
  function settingProfile(toastr, f321Api, $cookies) {
    var vm = this;
    vm.info = $.parseJSON($cookies.get('profile'));
    vm.submit = function () {
      if (!vm.info.realName || !vm.info.comName) {
        return toastr.warning('请输入正确的信息~', '警告');
      }
      //TODO:修改用户信息
      f321Api.user$modify(vm.info).then(function () {
        $cookies.put('profile', JSON.stringify(vm.info));
        window.location.reload();
      }, function (err) {
        toastr.error(err, '出错');
      })
    }

  }
})();
