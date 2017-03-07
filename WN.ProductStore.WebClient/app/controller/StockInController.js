/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('StockInController', ['$scope', 'StockService', '$state',
        function ($scope, StockService, $state) {
            $scope.queryString = "";
            $scope.pageIndex = 1;

            StockService.GetProductStockList($scope.pageIndex, $scope.queryString).success(function (response) {
                $scope.Stocks = response.ProductStockList;

                $scope.pageCount = Math.ceil(response.TotalCount / 10);
                for (var i = 0; i < $scope.pageCount; i++) {
                    $scope.pageList.push(i + 1);
                }
            });

            $scope.goAdd = function (product, stockId) {
                $state.go("stockAdd", {
                    product: product,
                    stockId: stockId
                });
            }

            $scope.seach = function () {
                StockService.GetProductStockList($scope.pageIndex, $scope.queryString).success(function (response) {
                    $scope.Stocks = response.ProductStockList;
                });
            }

            /**分页信息 */
            $scope.pageList = [];

            $scope.selectPage = function (page) {
                if (Number.isNaN(page) || page < 0) {
                    return;
                }
                //因为只显示5个页数，大于2页开始分页转换
                $scope.Stocks = [];
                StockService.GetProductStockList(page, $scope.queryString).success(function (response) {
                    $scope.Stocks = response.ProductStockList;
                });
            };

            //上一页
            $scope.Previous = function () {
                $scope.selectPage($scope.selPage - 1);
            }
            //下一页
            $scope.Next = function () {
                $scope.selectPage($scope.selPage + 1);
            };

        }
    ]);
});