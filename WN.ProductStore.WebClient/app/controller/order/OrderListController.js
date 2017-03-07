/**
 * Created by linyuebin .
 */
define(function (require) {
    var app = require('../../app.config');

    app.controller('OrderListController', ['$scope', 'OrderService', '$state',
        function ($scope, OrderService, $state) {

            $scope.orders = [];
            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.queryString = "";
            getOrderList();

            function getOrderList() {
                OrderService.GetOrderList($scope.pageIndex, $scope.pageSize, $scope.queryString).success(function (response) {
                    $scope.orders = response.Orders;

                });
            }
        }
    ]);
});