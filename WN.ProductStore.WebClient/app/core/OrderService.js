define(function (require) {
    var app = require('../app.config');
    app.service('OrderService', ['$http', 'baseUrl', function ($http, baseUrl) {


        return {
            GetOrderList: function (pageIndex, pageSize, queryString) {
                return $http.get(baseUrl + "/order/GetOrderList", {
                    params: {
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        queryString: queryString
                    }
                })
            },

            //提交订单
            AddOrder: function (order) {
                var transFn = function (order) {
                    return $.param(order);
                };
                var postCfg = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transFn
                };
                return $http.post(baseUrl + "/Order/AddOrder", order, postCfg);
            },

            //删除订单
            DeleteOrder: function (id) {
                return $http.get(baseUrl + "/order/DeleteOrder", {
                    params: {
                        id: id
                    }
                })
            },

        };
    }]);
});