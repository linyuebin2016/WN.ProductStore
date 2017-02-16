/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('StockInController', ['$scope','StockService', function ($scope,StockService) {
        StockService.getStockList().success(function (response) {
            $scope.StockList = response.Stocks;
        });
    }]);
});

