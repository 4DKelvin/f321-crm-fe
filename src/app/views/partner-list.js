(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('partnerList', partnerList);
  /** @ngInject */
  function partnerList(toastr, f321Api, $state) {
    var vm = this;
    vm.params = {
      index: 0,
      size: 10
    };
    vm.list = [];
    vm.count = 0;
    f321Api.partner$list(vm.params).then(function (res) {
      vm.list = res ? res.pageContent : [];
      vm.count = res.total;
    }, function (err) {
      toastr.error(err, '出错')
    });

    vm.getStatus = function (status) {
      switch (status) {
        case '10':
          return '一级审核通过';
        case '11':
          return '一级审核不通过';
        case '20':
          return '二级审核通过';
        case '21':
          return '二级审核不通过';
        case '0':
        default :
          return '待审核';
      }
    };
    vm.reject = function (item) {
      if (item) {
        f321Api.partner$audit([item.id], false).then(function (res) {
          toastr.success('设置成功', '操作成功');
        }, function (err) {
          toastr.error(err, '出错');
        })
      } else {
        var ids = [];
        vm.list.forEach(function (i) {
          if (i.checked) {
            ids.push(i.id);
          }
        });
        f321Api.partner$audit(ids, false).then(function (res) {
          toastr.success('设置成功', '操作成功');
        }, function (err) {
          toastr.error(err, '出错');
        })
      }
    };
    vm.passed = function (item) {
      if (item) {
        f321Api.partner$audit([item.id], true).then(function (res) {
          toastr.success('设置成功', '操作成功');
        }, function (err) {
          toastr.error(err, '出错');
        })
      } else {
        var ids = [];
        vm.list.forEach(function (i) {
          if (i.checked) {
            ids.push(i.id);
          }
        });
        f321Api.partner$audit(ids, true).then(function (res) {
          toastr.success('设置成功', '操作成功');
        }, function (err) {
          toastr.error(err, '出错');
        })
      }

    };
    vm.check = function () {
      vm.checked = !vm.checked;
      vm.list.forEach(function (item) {
        item.checked = vm.checked;
      });
    }
  };
})();
