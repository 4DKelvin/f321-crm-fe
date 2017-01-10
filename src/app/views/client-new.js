(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('clientNew', clientNew);
  /** @ngInject */
  function clientNew(toastr, f321Api, $state) {
    var vm = this;
    vm.params = {
      crmContactList: []
    };
    vm.locations = $.parseJSON(localStorage.getItem('location'));
    if (!vm.locations) {
      f321Api.dict$loc().then(function (res) {
        var find = function (sn) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].sn == sn) {
              return res[i];
            }
          }
          return false;
        };
        vm.locations = res.map(function (loc) {
          loc.parentName = find(loc.parent).nameCn
          return loc;
        });
        localStorage.setItem('location', JSON.stringify(vm.locations));
      }, function (err) {

      });
    }
    f321Api.enum$intention$Type().then(function (res) {
      vm.intentionType = [];
      for (var key in res) {
        vm.intentionType.push({
          name: res[key],
          value: key
        });
      }
    }, function (err) {

    });
    f321Api.enum$warehouse$type().then(function (res) {
      vm.warehouseType = [];
      for (var key in res) {
        vm.warehouseType.push({
          name: res[key],
          value: key
        });
      }
    }, function (err) {

    });
    vm.addContact = function () {
      vm.params.crmContactList.push({
        name: '',
        sex: '',
        mobile: '',
        tel: '',
        dept: '',
        email: '',
        fax: '',
        isPrimary: false
      });
    };
    vm.remove = function (contact) {
      vm.params.crmContactList.splice(vm.params.crmContactList.indexOf(contact), 1);
    };
    vm.submit = function () {
      if (!vm.params.name || !vm.params.industry || !vm.params.loc || !vm.crmContactList.some(function (e) {
          return !e.name || !e.sex || !(e.mobile || e.tel) || !e.isPrimary;
        })) {
        return toastr.error('请输入完整的信息', '出错');
      }
      f321Api.customer$save(vm.params).then(function () {
        toastr.success('添加客户信息成功~', '操作成功');
        $state.go(-1);
      }, function (err) {
        toastr.error(err, '出错');
      });
    };
  }
})();
