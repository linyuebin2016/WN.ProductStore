/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductListController', ['$scope','$http','ProductService', function ($scope,$http,ProductService) {
        // shortcut to get angular injected service.
        //var service = app.get('ProductService');
        ProductService.getProductList().success(function (response) {
            $scope.productList = response.Products;
        });
    }]);
});

