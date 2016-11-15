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
        cache: false
      }, transferData);
      $log.debug(options);
      $http(options).success(function (data) {
        $log.debug(data);
        if (data.code == "200") {
          deferred.resolve(data.content);
        } else if (data.code == '500') {
          //登录失效
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
      login: function (account, password) {
        return this.base.post('login', {
          account: account,
          password: password
        })
      }
    };
  }
})();
