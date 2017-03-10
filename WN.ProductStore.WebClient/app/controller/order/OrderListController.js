/**
 * Created by linyuebin .
 */
define(function (require) {
    var app = require('../../app.config');

    app.controller('OrderListController', ['$scope', 'OrderService', '$state', 'baseImgServer',
        function ($scope, OrderService, $state, baseImgServer) {
            $scope.baseImgServer = baseImgServer;
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

            //删除订单
            $scope.deleteOrder = function (id) {
                OrderService.DeleteOrder(id).success(function () {
                    alert("删除成功！");
                    getOrderList();
                });
            }
        }
    ]);
});