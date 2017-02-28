/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductListController', ['$scope', '$state', 'ProductService', 'baseImgServer',
        function ($scope, $state, ProductService, baseImgServer) {
            $scope.baseImgServer = baseImgServer;

            getList();

            //修改商品
            $scope.modifyProduct = function (spid) {
                $state.go('productAM', {
                    spid: spid
                });
            };

            $scope.delete = function (id) {
                ProductService.delete(id).success(function (response) {
                    alert("删除成功！");
                    getList();
                });
            }

            function getList() {
                ProductService.getProductList().success(function (response) {
                    $scope.productList = response.Products;
                });
            }

            function getPages() {

            }
        }
    ]);
});