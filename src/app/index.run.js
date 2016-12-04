(function () {
  'use strict';
  angular
    .module('f321CrmFe')
    .filter('loc', function () {
      return function (data) {
        var locations = $.parseJSON(localStorage.getItem('location'));

        function find(sn) {
          if (sn) {
            for (var i = 0; i < locations.length; i++) {
              if (locations[i].sn == sn) {
                return locations[i].nameCn;
              }
            }
          }
          return '';
        }

        return find(data);
      };
    })
    .filter('warehouse', function () {
      return function (data) {
        var warehouses = $.parseJSON(localStorage.getItem('warehouse'));

        function find(sn) {
          if (sn) {
            for (var i = 0; i < warehouses.length; i++) {
              if (warehouses[i].value == sn) {
                return warehouses[i].name;
              }
            }
          }
          return '';
        }

        return find(data);
      };
    }).run(runBlock);

  /** @ngInject */
  function runBlock($timeout, $rootScope, $cookies, $state, toastr) {
    $rootScope.$on('$stateChangeStart',
      function (event, toState) {
        if (toState.key != 'login' && !$cookies.get('profile')) {
          event.preventDefault();
          toastr.warning('你的会话已经断开,请重新登录', '警告');
          $state.go('login');
        } else if (toState.key == 'login') {
          if ($cookies.get('profile') && $cookies.get('autoLogin')) {
            event.preventDefault();
            toastr.info('系统已自动登录完成', '提示');
            $state.go('home');
          }
        }
      });
    $timeout(function () {
      // Tooltip 提示信息
      $('[data-rel=tooltip]').tooltip();
    });
  }

})();
