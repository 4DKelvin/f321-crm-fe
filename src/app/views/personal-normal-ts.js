(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('personalNormalTs', personalNormalTs);
  /** @ngInject */
  function personalNormalTs(f321Api, toastr, $state) {
    var vm = this,
      tab = ['p-normal-ts', 'p-service-ts', '', 'p-continues-ts', 'p-important-ts'];
    vm.params = {
      index: 1,
      size: 10,
      warehouse: $.inArray($state.current.key, tab) + 1
    };
    vm.checked = false;
    vm.list = [];
    vm.checkedAll = function () {
      vm.checked = !vm.checked;
      vm.list.forEach(function (e) {
        e.checked = vm.checked;
      })
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
        vm.ts = res.ts;
        vm.freeTs = res.freeTs;
        vm.list = res && res.customerTsList ? res.customerTsList.map(function (e) {
          e.checked = false;
          return e;
        }) : [];
      }, function (err) {
        toastr.error(err, '操作失败');
      });
    };
    vm.bat = function () {
      f321Api.set$bat$ts(vm.list.map(function (ts) {
        if (ts.checked) {
          return ts.id;
        }
        return '';
      }), vm.params.ts, vm.params.warehouse).then(function (res) {
        toastr.success('批量修改TS值成功', '操作成功');
      }, function (err) {
        toastr.error(err, '操作失败');
      });
    };

    vm.submit = function () {
      f321Api.partner$apply(vm.addNew.id, vm.addNew.partnerId.value).then(function (res) {
        toastr.success('设置地勤人员成功', '操作成功');
        vm.addNew = false;
      }, function (err) {
        toastr.error(err, '操作失败');
      });
    };
    vm.search();

    f321Api.user$list({
      index: 0,
      size: 100
    }).then(function (res) {
      vm.accounts = res ? res.pageContent.map(function (acc) {
        return {
          name: acc.comName,
          value: acc.id
        };
      }) : [];
    }, function (err) {

    });
  }
})();
