/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductListController', ['$scope','$state','ProductService', function ($scope,$state,ProductService) {
        ProductService.getProductList().success(function (response) {
            $scope.productList = response.Products;
        });

        //修改商品
        $scope.modifyProduct = function(spid) {
            $state.go('productAM', {
                spid: spid
            });
        };
        function getPages(){

        }
    }]);
});

