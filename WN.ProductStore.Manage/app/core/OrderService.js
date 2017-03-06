define(function (require) {
    var app = require('../app.config');
    app.service('OrderService', ['$http', 'baseUrl', function ($http, baseUrl) {
   
        var pageSize = 10;
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
        };
    }]);
});