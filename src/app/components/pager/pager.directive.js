(function () {
  'use strict';
  angular
    .module('f321CrmFe')
    .directive('acePager', aceNavbar);
  document.createElement('ace-pager');
  /** @ngInject */
  function aceNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/pager/pager.html',
      scope: {
        index: '=?',
        size: '=?',
        count: '=',
        len: '='
      },
      /** @ngInject */
      controller: function ($scope, $element, $attrs) {
        $scope.$watch('index', function () {
          $scope.pager.pages = [];
          var len = Math.ceil(($scope.pager.count || 0) / $scope.pager.size);
          $scope.pager.canNext = $scope.pager.index < len;
          $scope.pager.canPrev = $scope.pager.index > 1;
          console.log($scope.pager.count, $scope.pager.size)
          for (var i = 1; i <= len; i++) {
            $scope.pager.pages.push({
              index: i
            })
          }
        });
        $scope.pager.next = function () {
          if ($scope.pager.canNext) {
            $scope.pager.index += 1;
          }
        };
        $scope.pager.prev = function () {
          if ($scope.pager.canPrev) {
            $scope.pager.index -= 1;
          }
        };
      },
      controllerAs: 'pager',
      bindToController: true
    };

    return directive;
  }

})();
