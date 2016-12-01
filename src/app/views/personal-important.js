(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('personalImportant', personalImportant);
  /** @ngInject */
  function personalImportant(f321Api, toastr) {
    var vm = this;
    vm.params = {
      index: 0,
      size: 10
    };
    vm.list = [];
    vm.count = 0;

    f321Api.kac$list(vm.params).then(function (res) {
      vm.list = res.pageContent;
      vm.count = res.total;
    }, function (err) {
      toastr.error(err, '出错')
    });
  }
})();
