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
    vm.check = function () {
      vm.checked = !vm.checked;
      vm.list.forEach(function (item) {
        item.checked = vm.checked;
      });
    };
    vm.list = [];
    vm.count = 0;
    vm.title = $state.current.text;
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
    vm.getData = function (params) {
      var defer = $q.defer(),
        result = {};
      f321Api.enum$warehouse$type().then(function (res) {
        if ($state.current.text.length > 5) {
          params.content.warehouse.value = 5;
          if ($state.current.text == '成交过公海客户') {
            params.content.hadTrading = true;
          } else if ($state.current.text == '自动放弃客户') {
            params.content.giveupType = 2;
          } else if ($state.current.text == '过陈列期客户') {
            params.content.isOpenLock = true;
          }
        } else {
          for (var key in res) {
            if (res[key] == $state.current.text) {
              params.content.warehouse.value = key;
            }
          }
        }
        result.warehouseType = res;
        return f321Api.peronal$normal(params);
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

    vm.askover = function () {
      var ids = [];
      vm.list.forEach(function (item) {
        if (item.checked) {
          ids.push(item.id)
        }
      });
      f321Api.akeover(ids, vm.target.value).then(function (res) {
        toastr.success('设置成功!', '操作成功');
        $state.reload();
      }, function (err) {
        toastr.error(err, '出错');
      })
    };

    vm.search = function () {
      vm.getData(vm.params).then(function (res) {
        vm.list = res.list ? res.list.pageContent : [];
        vm.count = res.list ? res.list.total : 0;
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
