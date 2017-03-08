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
 
        };
    }]);
});