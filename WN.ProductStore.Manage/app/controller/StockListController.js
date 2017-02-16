/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('StockListController', ['$scope','$http','StockService', function ($scope,$http,StockService) {
        // shortcut to get angular injected service.
        //var service = app.get('ProductService');
        StockService.getStockList().success(function (response) {
            $scope.StockList = response.Stocks;
        });
    }]);
});

