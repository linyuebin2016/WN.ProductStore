/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductListController', ['$scope','$http', function ($scope,$http) {
        // shortcut to get angular injected service.
        var service = app.get('ProductService');
        var list = service.getProductList();

        $http.get("http://10.52.0.87/ProductStroe/api/Product/GetProductList?pageIndex=0&pageSize=10&name=")
            .success(function (response) {
                $scope.productList = response.Products;
            });
    }]);
});

