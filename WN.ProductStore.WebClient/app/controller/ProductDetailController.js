/**
 * Created by shengxiangyang on 2017-02-14.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductDetailController', ['$scope', '$http', '$sce', '$state', '$stateParams', 'ProductService', 'baseImgServer', 'CarService',
        function ($scope, $http, $sce, $state, $stateParams, ProductService, baseImgServer, CarService) {
            $scope.baseImgServer = baseImgServer;

            $scope.model = {};

            var spid = $stateParams.spid;
            $scope.isEdit = false;
            $scope.title = "新增商品";
            if (spid != null && spid != "") {
                getProductDetail(spid);
                $scope.isEdit = true;
                $scope.title = "商品详细";
            }

            function getProductDetail(spid) {
                ProductService.getProductDetail(spid).success(function (response) {
                    $scope.model = response.Product;
                    $scope.ProductImages = response.ProductImages;
                });
            }

            $scope.goOrderAdd = function (ProductId) {
                var cars = [{
                    ProductId: ProductId,
                    Quantity: 1
                }];
                $state.go("orderAdd", {
                    cars: cars
                });
            }

            //添加购物车
            $scope.addCar = function () {
                var car = {
                    ProductId: spid,
                    Quantity: 1,
                };
                CarService.Add(car).success(function () {

                    alert('添加成功！');
                    $state.go("home.productList");
                });
            }


            $scope.goTo = function (target) {
                $state.go(target);
            }
        }
    ]);
});