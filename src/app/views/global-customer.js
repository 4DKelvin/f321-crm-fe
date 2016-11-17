(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('globalCustomer', globalCustomer);
  /** @ngInject */
  function globalCustomer($q, f321Api, toastr, $stateParams) {
    var vm = this;
    vm.getData = function () {
      var defer = $q.defer(),
        result = {};
      f321Api.enum$warehouse$type().then(function (res) {
        result.warehouseType = [];
        for (var key in res) {
          result.warehouseType.push({
            name: res[key],
            value: key
          });
        }
        return f321Api.enum$intention$Type();
      }, function (err) {
        defer.reject(err);
      }).then(function (res) {
        result.intentionType = [];
        for (var key in res) {
          result.intentionType.push({
            name: res[key],
            value: key
          });
        }
        return f321Api.enum$customer$giveup$type();
      }, function (err) {
        defer.reject(err);
      }).then(function (res) {
        result.giveupType = [];
        for (var key in res) {
          result.giveupType.push({
            name: res[key],
            value: key
          });
        }
        return f321Api.enum$giveup$reason();
      }, function (err) {
        defer.reject(err);
      }).then(function (res) {
        result.giveupReason = [];
        for (var key in res) {
          result.giveupReason.push({
            name: res[key],
            value: key
          });
        }
        return f321Api.enum$customer$conflict$type();
      }, function (err) {
        defer.reject(err);
      }).then(function (res) {
        result.conflictType = [];
        for (var key in res) {
          result.conflictType.push({
            name: res[key],
            value: key
          });
        }
        return f321Api.enum$customer$operate$type();
      }, function (err) {
        defer.reject(err);
      }).then(function (res) {
        result.operateType = [];
        for (var key in res) {
          result.operateType.push({
            name: res[key],
            value: key
          });
        }
        return f321Api.customer$info($stateParams.id);
      }, function (err) {
        defer.reject(err);
      }).then(function (res) {
        result.info = res;
        result.intentionType.forEach(function (type) {
          if (type.value == result.info.crmCustomerVo.intention) {
            result.info.crmCustomerVo.intention = type;
          }
        });
        result.warehouseType.forEach(function (type) {
          if (type.value == result.info.crmCustomerVo.warehouse) {
            result.info.crmCustomerVo.warehouse = type;
          }
        });
        if (result.info.crmOperatorLogList) {
          result.info.crmOperatorLogList = result.info.crmOperatorLogList.map(function (log) {
            res.operateType.forEach(function (type) {
              if (log.type == type.value) {
                log.type = type;
              }
              return log;
            });
          });
        }
        if (result.info.crmGiveupLogList) {
          result.info.crmGiveupLogList = result.info.crmGiveupLogList.map(function (log) {
            result.giveupType.forEach(function (type) {
              if (type.value == log.type) {
                log.type = type;
              }
            });
            result.giveupReason.forEach(function (type) {
              if (type.value == log.reasonId) {
                log.reasonId = type;
              }
            });
            result.conflictType.forEach(function (type) {
              if (type.value == log.conflictType) {
                log.conflictType = type;
              }
            });
            return log;
          });
        }
        defer.resolve(result);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    };

    vm.getData(vm.params).then(function (res) {
      vm.info = res.info;
      vm.warehouseType = res.warehouseType;
      vm.intentionType = res.intentionType;
    }, function (err) {
      toastr.error(err, '出错')
    });
  }
})();
