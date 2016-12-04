(function () {
  'use strict';
  angular
    .module('f321CrmFe')
    .directive('aceNavbar', aceNavbar);
  document.createElement('ace-navbar');
  /** @ngInject */
  function aceNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {},
      /** @ngInject */
      controller: function ($state, $cookies, toastr, f321Api) {
        var vm = this;
        vm.short = [
          {
            url: '#/client/new',
            name: '新录入新客户'
          }
        ];
        vm.logout = function () {
          $cookies.remove('profile');
          $cookies.remove('autoLogin');
          $state.go('login');
          return toastr.info('你已经安全退出', '操作成功');
        };
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
              loc.parentName = find(loc.parent).nameCn;
              return loc;
            });
            localStorage.setItem('location', JSON.stringify(vm.locations));
          }, function (err) {

          });
        }
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
      },
      controllerAs: 'bar',
      bindToController: true
    };

    return directive;
  }

})();
