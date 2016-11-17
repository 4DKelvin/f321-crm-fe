(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('personalNormal', personalNormal);
  /** @ngInject */
  function personalNormal(f321Api, toastr) {
    var vm = this;
    vm.params = {
      index: 0,
      size: 10,
      content: {
        keyword: '',
        warehouse: 10
      }
    };
    f321Api.peronal$normal(vm.params).then(function (res) {
    }, function (err) {

    });
  }
})();
