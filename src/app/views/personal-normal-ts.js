(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('personalNormalTs', personalNormalTs);
  /** @ngInject */
  function personalNormalTs(f321Api, toastr, $state) {
    var vm = this,
      tab = ['p-normal-ts', 'p-service-ts', 'p-continues-ts', 'p-important-ts'];
    vm.params = {
      index: 0,
      size: 10,
      warehouse: $.inArray($state.current.key, tab) + 1
    };
    vm.list = [];

    f321Api.peronal$ts(vm.params).then(function (res) {
      vm.list = res;
    }, function (err) {
      toastr.error(err, '操作失败');
    });
  }
})();
