define(function (require) {
    var angular = require('angular');
    var app = require('../app.config');
    app.service('StockService', ['$http',function($http) {
        return {
            getStockList : function() {
                return $http.get("http://10.52.0.87/ProductStroe/api/Stock/GetStockList",{
                    params: {
                        pageIndex: 0,
                        pageSize: 10
                    }
                })
            }
        };
    }]);
});
