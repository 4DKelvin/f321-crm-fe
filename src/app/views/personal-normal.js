(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('personalNormal', personalNormal);
  /** @ngInject */
  function personalNormal(f321Api, toastr, $state) {
    var vm = this,
      tab = ['p-normal', 'p-service', 'p-continues','p-important'];
    vm.params = {
      index: 0,
      size: 10,
      content: {
        keyword: '',
        warehouse: $.inArray($state.current.key, tab) + 1
      }
    };
    vm.list = [];
    vm.count = 0;
    f321Api.peronal$normal(vm.params).then(function (res) {
      vm.list = res.pageContent;
      vm.count = res.total;
    }, function (err) {
      toastr.error(err, '出错')
    });
  }
})();
