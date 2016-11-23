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
      f321Api.customer$save(vm.params).then(function () {
        toastr.success('添加客户信息成功~', '操作成功');
        $state.go(-1);
      }, function (err) {
        toastr.error(err, '出错');
      });
    };
  }
})();
