/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('StockInController', ['$scope', 'StockService', '$state',
        function ($scope, StockService, $state) {
            $scope.queryString = "";

            StockService.GetProductStockList($scope.queryString).success(function (response) {
                $scope.Stocks = response.ProductStockList;
            });

            $scope.goAdd = function (product, stockId) {
                $state.go("stockAdd", {
                    product: product,
                    stockId: stockId
                });
            }

            $scope.seach = function () {
                StockService.GetProductStockList($scope.queryString).success(function (response) {
                    $scope.Stocks = response.ProductStockList;
                });
            }
        }
    ]);
});