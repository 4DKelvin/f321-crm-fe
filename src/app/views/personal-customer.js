(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('personalCustomer', personalCustomer);
  /** @ngInject */
  function personalCustomer($q, f321Api, toastr, $state) {
    var vm = this;
    vm.params = {
      index: 0,
      size: 10,
      content: {
        keyword: '',
        warehouse: {
          value: 1
        }
      }
    };
    vm.list = [];
    vm.count = 0;
    vm.title = $state.current.text;
    vm.getData = function (params) {
      var defer = $q.defer(),
        result = {};
      f321Api.enum$warehouse$type().then(function (res) {
        for (var key in res) {
          if (res[key] == $state.current.text) {
            params.content.warehouse.value = key;
          }
        }
        result.warehouseType = res;
        return f321Api.customer$normal(params);
      }, function (err) {
        defer.reject(err);
      }).then(function (res) {
        result.list = res;
        defer.resolve(result);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    };

    vm.search = function () {
      vm.getData(vm.params).then(function (res) {
        vm.list = res.list.pageContent;
        vm.count = res.list.total;
        vm.warehouseType = [];
        for (var key in res.warehouseType) {
          vm.warehouseType.push({
            name: res.warehouseType[key],
            value: key
          });
        }
      }, function (err) {
        toastr.error(err, '出错')
      });
    };
    vm.search();
  }
})();
