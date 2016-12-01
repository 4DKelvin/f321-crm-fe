(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('adminList', adminList);
  /** @ngInject */
  function adminList(toastr, f321Api, $state) {
    var vm = this;
    vm.params = {
      index: 0,
      size: 10
    };
    vm.list = [];
    vm.count = 0;
    f321Api.user$list(vm.params).then(function (res) {
      vm.list = res ? res.pageContent : [];
      vm.count = res.total;
    }, function (err) {
      toastr.error(err, '出错')
    });
  };
})();
