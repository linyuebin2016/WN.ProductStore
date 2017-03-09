define(function (require) {
    var app = require('../app.config');
    app.service('CarService', ['$http', 'baseUrl', function ($http, baseUrl) {


        return {
            GetCarList: function (pageIndex, pageSize, queryString) {
                return $http.get(baseUrl + "/car/GetCarList", {
                    params: {
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        queryString: queryString
                    }
                })
            },
            //保存客户
            Add: function (car) {
                var transFn = function (car) {
                    return $.param(car);
                };
                var postCfg = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transFn
                };
                return $http.post(baseUrl + "/car/add", car, postCfg);
            },

        };
    }]);
});