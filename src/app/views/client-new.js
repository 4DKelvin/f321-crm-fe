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
        vm.locations = [];
        var find = function(items,parent){
          var returnVal = -1;
          items.forEach(function(e){
            if(e.sn == parent){
              returnVal = e;
            }
          });
          return returnVal;
        };
        res.forEach(function(e){
          if(e.parent=='1'){
            vm.locations.push(e);
          }else if(find(vm.locations,e.parent)!=-1){
            var parent = find(vm.locations,e.parent);
            if(!parent.items){
              parent.items = [];
            }
            parent.items.push(e);
          }else{
            vm.locations.forEach(function(loc){
              if(find(loc.items, e.parent)!=-1){
                var parent = find(loc.items, e.parent);
                if(!parent.items){
                  parent.items = [];
                }
                parent.items.push(e);
              }
            })
          }
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
