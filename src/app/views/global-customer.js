(function () {
  'use strict';

  angular
    .module('f321CrmFe')
    .controller('globalCustomer', globalCustomer);
  /** @ngInject */
  function globalCustomer($q, f321Api, toastr, $stateParams, $scope, $state, $cookies) {
    var vm = this;
    vm.profile = $.parseJSON($cookies.get('profile'));
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
            result.operateType.forEach(function (type) {
              if (log.type == type.value) {
                log.type = type;
              }
            });
            return log;
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
        vm.locations.forEach(function (type) {
          if (type.sn == result.info.crmCustomerVo.loc) {
            result.info.crmCustomerVo.loc = type;
          }
        });
        result.info.crmContactNew = [];
        result.info.crmContactLogNew = [];
        defer.resolve(result);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    };

    vm.getData(vm.params).then(function (res) {
      vm.info = res.info;
      vm.giveupReason = res.giveupReason;
      vm.giveupType = res.giveupType;
      vm.conflictType = res.conflictType;
      vm.warehouseType = res.warehouseType;
      vm.intentionType = res.intentionType;
      vm.isOwner = vm.info.crmCustomerVo.ownerId == vm.profile.id;
    }, function (err) {
      toastr.error(err, '出错')
    });

    vm.saveGiveup = function (giveup) {
      giveup.customerId = $stateParams.id;
      f321Api.giveup$save(giveup).then(function (res) {
        if (vm.info.crmGiveupLog) {
          f321Api.giveup$log($stateParams.id, vm.info.crmGiveupLog.page, vm.info.crmGiveupLog.size).then(function (res) {
            vm.info.crmGiveupLogList = res.pageContent;
            vm.info.crmGiveupLog.total = res.total;
            toastr.success('放弃客户成功!', '操作成功');
            window.location.reload();
          }, function (err) {
            toastr.error(err, '出错');
          });
        } else {
          toastr.success('放弃客户成功!', '操作成功');
          window.location.reload();
        }
      }, function (err) {
        toastr.error(err, '出错');
      });
    };
    vm.saveLog = function (log) {
      log.contactDt = new Date().toDateString();
      log.customerId = $stateParams.id;
      f321Api.contact$log$save(log).then(function (res) {
        if (vm.info.crmContactLog) {
          f321Api.contact$log($stateParams.id, vm.info.crmContactLog.page, vm.info.crmContactLog.size).then(function (res) {
            vm.info.crmContactLogList = res.pageContent;
            vm.info.crmContactLog.total = res.total;
            toastr.success('添加成功!', '操作成功');
            window.location.reload();
          }, function (err) {
            toastr.error(err, '出错');
          });
        } else {
          toastr.success('添加成功!', '操作成功');
          window.location.reload();
        }
      }, function (err) {
        toastr.error(err, '出错');
      });
    };

    vm.setTs = function (ts) {
      f321Api.set$ts([$stateParams.id], ts, vm.info.crmCustomerVo.warehouse.value).then(function (res) {
        toastr.success('设置成功!', '操作成功');
        $state.reload();
      }, function (err) {
        toastr.error(err, '出错');
      })
    };

    vm.obtain = function () {
      f321Api.obtain($stateParams.id).then(function (res) {
        toastr.success('设置成功!', '操作成功');
        $state.reload();
      }, function (err) {
        toastr.error(err, '出错');
      });
    };

    vm.takeover = function () {
      f321Api.takeover([$stateParams.id]).then(function (res) {
        toastr.success('设置成功!', '操作成功');
        $state.reload();
      }, function (err) {
        toastr.error(err, '出错');
      });
    };
    vm.setConflict = function () {
      f321Api.set$conflict([$stateParams.id]).then(function (res) {
        toastr.success('设置成功!', '操作成功');
        $state.reload();
      }, function (err) {
        toastr.error(err, '出错');
      });
    };

    vm.important = function (flag) {
      f321Api.customer$kac(flag, $stateParams.id).then(function (res) {
        toastr.success('设置成功!', '操作成功');
        $state.reload();
      }, function (err) {
        toastr.error(err, '出错');
      })
    };

    vm.saveContact = function (contact) {
      contact.customerId = $stateParams.id;
      f321Api.contact$save(contact).then(function (res) {
        f321Api.contact($stateParams.id, 1, 100).then(function (res) {
          vm.info.crmContactList = res;
        }, function (err) {
          toastr.error(err, '出错');
        });
        toastr.success('添加成功!', '操作成功');
        vm.info.crmContactNew.splice(vm.info.crmContactNew.indexOf(contact), 1);
      }, function (err) {
        toastr.error(err, '出错');
      });
    };

    $scope.$watch('gc.info.crmContactLog.page', function () {
      if (vm.info) {
        f321Api.contact$log($stateParams.id, vm.info.crmContactLog.page, vm.info.crmContactLog.size).then(function (res) {
          vm.info.crmContactLogList = res.pageContent;
          vm.info.crmContactLog.total = res.total;
        }, function (err) {
          toastr.error(err, '出错');
        })
      }
    });

    $scope.$watch('gc.info.crmGiveupLog.page', function () {
      if (vm.info) {
        f321Api.giveup$log($stateParams.id, vm.info.crmGiveupLog.page, vm.info.crmGiveupLog.size).then(function (res) {
          vm.info.crmGiveupLogList = res.pageContent;
          vm.info.crmGiveupLog.total = res.total;
        }, function (err) {
          toastr.error(err, '出错');
        })
      }
    }, true);
    $scope.$watch('gc.info.crmOperatorLog.page', function () {
      if (vm.info) {
        f321Api.operator$log($stateParams.id, vm.info.crmOperatorLog.page, vm.info.crmOperatorLog.size).then(function (res) {
          vm.info.crmOperatorLogList = res.pageContent;
          vm.info.crmOperatorLog.total = res.total;
        }, function (err) {
          toastr.error(err, '出错');
        })
      }
    }, true);


    vm.partnerApply = function () {
      f321Api.partner$apply(vm.partner.id, vm.partner.partnerId.value).then(function (res) {
        toastr.success('设置地勤人员成功', '操作成功');
        vm.partner = false;
      }, function (err) {
        toastr.error(err, '操作失败');
      });
    };

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
  }
})();
