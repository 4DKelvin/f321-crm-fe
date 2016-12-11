(function () {
  'use strict';

  angular
    .module('f321CrmFe').controller('clientSearch', clientSearch);
  /** @ngInject */
  function clientSearch($q, f321Api, toastr, $stateParams, $scope, $state, $cookies) {
    var vm = this;
    vm.params = {
      index: 0,
      size: 10,
      content: {
      }
    };
    vm.warehouseType = $.parseJSON(localStorage.getItem('warehouse'));
    if (!vm.warehouseType) {
      f321Api.enum$warehouse$type().then(function (res) {
        vm.warehouseType = [];
        for (var key in res) {
          vm.warehouseType.push({
            name: res[key],
            value: key
          });
        }
        localStorage.setItem('warehouse', JSON.stringify(vm.warehouseType));
      }, function (err) {

      });
    }
    vm.search = function(){
      f321Api.search(vm.params).then(function (res) {
        vm.list = res ? res.pageContent : [];
        vm.count = res.total;
      }, function (err) {
        toastr.error(err, '出错')
      });
    };
  };
})();
