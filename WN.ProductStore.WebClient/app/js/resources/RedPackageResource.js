define(["app", "services/BaseService"], function(app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "redpack/", BaseService.restfulUrl + "ygpay/", BaseService.formHeader);
    }

    function initResource($http, redpackUrl, ygpayUrl, formHeader) {
        return {
            // 创建红包
            createPack: function(redPack) {
                return $http.post(redpackUrl + 'createPack', JSON.stringify(redPack));
            },
            // 抢红包
            snatchPack: function(packId) {
                return $http.post(redpackUrl + 'snatchPack', {
                    packId: packId
                }, {
                    headers: formHeader
                });
            },
            // 查询某个红包
            getPack: function(packId) {
                return $http.get(redpackUrl + 'getPack', {
                    params: {
                        packId: packId
                    }
                });
            },
            // 某个用户的红包记录
            getUserPackSum: function(companyCode) {
                return $http.get(redpackUrl + 'getUserPackSum', {
                    params: {
                        companyCode: companyCode
                    }
                });
            },
            getUserPack: function(companyCode, type, timestamp, direction, pageSize) {
                return $http.get(redpackUrl + 'getUserPack', {
                    params: {
                        companyCode: companyCode,
                        type: type,
                        timestamp: timestamp,
                        direction: direction,
                        pageSize: pageSize
                    }
                });
            },

            // 查我的余额
            getAccount: function() {
                return $http.get(ygpayUrl + 'getAccount');
            },
            // 充值
            recharge: function(amount) {
                return $http.post(ygpayUrl + 'recharge', {
                    amount: amount
                }, {
                    headers: formHeader
                });
            },
            // 提现
            withdraw: function(amount) {
                return $http.post(ygpayUrl + 'withdraw', {
                    amount: amount
                }, {
                    headers: formHeader
                });
            },
            // 明细
            userTransaction: function(companyCode, timestamp, direction, pageSize) {
                return $http.get(ygpayUrl + 'userTransaction', {
                    params: {
                        companyCode: companyCode,
                        timestamp: timestamp,
                        direction: direction,
                        pageSize: pageSize
                    }
                });
            }
        }
    }

    resource.$inject = deps;
    app.lazy.factory("RedPackageResource", resource);
});
