define(function (require) {
    var angular = require('angular');
    var app = require('../app.config');
    app.service('StockService', ['$http', function ($http) {
        var requestUrl = "http://localhost/ProductStore/api";
        var pageSize = 10;
        return {
            getStockList: function () {
                return $http.get(requestUrl + "/Stock/GetStockList", {
                    params: {
                        pageIndex: 0,
                        pageSize: 10
                    }
                })
            },
            /**获取产品对应的库存数量 */
            GetProductStockList: function (pageIndex, queryString) {
                return $http.get(requestUrl + "/Stock/GetProductStockList", {
                    params: {
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        queryString: queryString
                    }
                })
            },

            /**保存库存 */
            SaveStock: function (productId, quantity, stockId) {
                return $http.get(requestUrl + "/Stock/SaveStock", {
                    params: {
                        productId: productId,
                        quantity: quantity,
                        stockId: stockId
                    }

                })
            },
        };
    }]);
});