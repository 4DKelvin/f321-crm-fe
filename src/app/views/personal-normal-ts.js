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
      index: 1,
      size: 10,
      warehouse: $.inArray($state.current.key, tab) + 1
    };
    vm.list = [];


    vm.checked = function () {
      var flag = vm.isCheckedAll();
      vm.list = vm.list.map(function (e) {
        e.checked = !flag;
        return e;
      })
    };
    vm.isCheckedAll = function () {
      return vm.list.map(function (e) {
          if (!e.checked) {
            return '1';
          }
          return '';
        }).join('').length > 0;
    };
    vm.saveTs = function (ts) {
      f321Api.set$ts([ts.id], ts.lockTs, vm.params.warehouse).then(function (res) {
        toastr.success('修改TS值成功', '操作失败');
      }, function (err) {
        toastr.error(err, '操作失败');
      });
    };
    vm.search = function () {
      f321Api.peronal$ts(vm.params).then(function (res) {
        vm.list = res;
      }, function (err) {
        toastr.error(err, '操作失败');
      });
    };
    vm.bat = function () {
      f321Api.set$ts(vm.list.map(function (ts) {
        return ts.id;
      }), vm.params.ts, vm.params.warehouse).then(function (res) {
        toastr.success('批量修改TS值成功', '操作失败');
      }, function (err) {
        toastr.error(err, '操作失败');
      });
    };
  }
})();
