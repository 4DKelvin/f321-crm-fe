(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .directive('aceSidebar', aceSidebar);

  document.createElement('ace-sidebar');

  /** @ngInject */
  function aceSidebar(short_url, $location) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sidebar/sidebar.html',
      scope: {
        mini: '=?'
      },
      /** @ngInject */
      controller: function () {
        var vm = this;
        vm.menus = [];
        function find(name, icon) {
          var result = null;
          vm.menus.forEach(function (menu) {
            if (menu.name == name && menu.icon == icon) {
              result = menu.items;
            }
          });
          if (!result) {
            vm.menus[vm.menus.length] = {
              name: name,
              icon: icon,
              items: []
            };
            result = vm.menus[vm.menus.length - 1].items;
          }
          return result;
        }

        short_url.forEach(function (item) {
          find(item.group, item.groupIco).push(item);
        });
        vm.menus = vm.menus.map(function (menu) {
          menu.items = menu.items.map(function (item) {
            item.active = item.url == $location.$$url;
            return item;
          });
          menu.active = menu.items.map(function (item) {
            if (item.active) {
              return 'active';
            }
            return '';
          }).join('').length;
          return menu;
        });
      },
      controllerAs: 'side',
      bindToController: true
    };

    return directive;
  }

})();
