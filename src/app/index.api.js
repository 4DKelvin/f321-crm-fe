/* global malarkey:false, moment:false */
(function () {
  'use strict';
  angular
    .module('f321CrmFe')
    .factory('f321Api', f321Api);
  /** @ngInject */
  function f321Api($q, $http, $log, $cookies, base_uri) {
    var request = function (path, params, method) {
      $('body').addClass('loading');
      var deferred = $q.defer(),
        url = base_uri + path,
        profile = $.parseJSON($cookies.get('profile') || '{}'),
        token = profile.token,
        userId = profile.id,
        data = {
          token: token ? token : '',
          userId: userId ? userId : ''
        }, transferData = (method == 'GET' || method == 'DELETE' ? {
          params: $.extend(data, params)
        } : {
          data: (path != 'login' ? $.extend(data, {
            requestData: params
          }) : params)
        });
      var options = $.extend({
        url: url,
        method: method,
        cache: true
      }, transferData);
      $http(options).success(function (data) {
        if (data.status == "200") {
          deferred.resolve(data.content);
        } else {
          deferred.reject(data.message);
        }
        $('body').removeClass('loading');
      }).error(function () {
        deferred.reject('网络出现问题');
        $('body').removeClass('loading');
      });
      return deferred.promise;
    };
    return {
      base: {
        get: function (path, params) {
          return request(path, params, 'GET');
        },
        post: function (path, params) {
          return request(path, params, 'POST');
        },
        put: function (path, params) {
          return request(path, params, 'PUT');
        },
        delete: function (path, params) {
          return request(path, params, 'DELETE');
        }
      },
      convert: function (params) {
        return $.parseJSON(JSON.stringify(params));
      },
      login: function (account, password) {
        return this.base.post('login', {
          account: account,
          password: password
        })
      },
      system$enum: function (enumName) {
        return this.base.get('system/enum', {
          enumName: enumName
        })
      },
      customer$save: function (params) {
        return this.base.post('customer', this.convert(params));
      },
      contact$log$save: function (params) {
        var obj = this.convert(params);
        for (var key in obj) {
          if (obj[key].constructor == Object) {
            obj[key] = obj[key].value || obj[key].sn;
          }
        }
        return this.base.post('contactLog', obj);
      },
      contact$log: function (customerId, index, size) {
        return this.base.post('contactLog/' + customerId + '/page', {
          index: index,
          size: size,
          customerId: customerId
        })
      },
      contact$save: function (params) {
        return this.base.post('contact', this.convert(params));
      },
      contact: function (customerId, index, size) {
        return this.base.post('contact/' + customerId + '/page', {
          index: index,
          size: size,
          customerId: customerId
        })
      },
      giveup$log: function (customerId, index, size) {
        return this.base.post('giveupLog/' + customerId + '/page', {
          index: index,
          size: size,
          customerId: customerId
        })
      },
      giveup$save: function (params) {
        var p = this.convert(params);
        for (var key in p) {
          if (p[key].value) {
            p[key] = p[key].value;
          }
        }
        return this.base.post('customer/giveup', p);

      },
      operator$log: function (customerId, index, size) {
        return this.base.post('operatorLog/' + customerId + '/page', {
          index: index,
          size: size,
          customerId: customerId
        });
      },
      set$ts: function (customerIdList, ts, warehouseType) {
        return this.base.post('customer/setTS', {
          customerIdList: customerIdList,
          ts: ts,
          warehouseType: warehouseType
        });
      },
      set$bat$ts: function (customerIdList, freeTS, warehouseType) {
        return this.base.post('customer/batchSetTS', {
          customerIdList: customerIdList,
          freeTs: freeTS,
          warehouseType: warehouseType
        });
      },
      enum$warehouse$type: function () {
        return this.system$enum('WarehouseType');
      },
      enum$train$column: function () {
        return this.system$enum('TrainColumn');
      },
      enum$kac$level: function () {
        return this.system$enum('KacLevel');
      },
      enum$intention$Type: function () {
        return this.system$enum('IntentionType');
      },
      enum$giveup$reason: function () {
        return this.system$enum('GiveUpReason');
      },
      enum$customer$operate$type: function () {
        return this.system$enum('CustomerOperateType');
      },
      enum$customer$giveup$type: function () {
        return this.system$enum('CustomerGiveUpType');
      },
      enum$customer$conflict$type: function () {
        return this.system$enum('CustomerConflictType');
      },
      enum$customer$attribute$type: function () {
        return this.system$enum('CustomerAttributeType');
      },
      system$dictionary: function (dictionaryType) {
        return this.base.get('system/dictionary', {
          dictionaryType: dictionaryType
        })
      },
      customer$kac: function (isKac, customerId) {
        return this.base[isKac ? 'post' : 'put']('/customer/kac', {
          customerId: customerId
        });
      },
      kac$list: function (params) {
        return this.base.post('customer/kac/page', this.convert(params))
      },
      dict$loc: function () {
        return this.system$dictionary('loc')
      },
      peronal$normal: function (params) {
        return this.base.post('customer/my/page', this.convert(params));
      },
      customer$normal: function (params) {
        var obj = this.convert(params);
        obj.content.warehouse = obj.content.warehouse.value;
        return this.base.post('customer/page', obj);
      },
      peronal$ts: function (params) {
        return this.base.post('customer/ts', this.convert(params));
      },
      customer$info: function (customerId) {
        return this.base.get('customer/' + customerId);
      },
      user$list: function (params) {
        return this.base.post('user/page', this.convert(params));
      },
      user$save: function (params) {
        return this.base[params.id ? 'post' : 'put']('user', this.convert(params));
      }
    };
  }
})();
