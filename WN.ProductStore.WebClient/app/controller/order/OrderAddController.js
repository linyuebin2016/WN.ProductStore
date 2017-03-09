/**
 * Created by linyuebin .
 */
define(function (require) {
    var app = require('../../app.config');

    app.controller('OrderAddController', ['$scope', 'OrderService', '$state',
        function ($scope, OrderService, $state) {

            $scope.order = {};

            $scope.orderDetails = [{
                ProductId: 'bbc1d532-ee6c-4284-b24a-24f9f443df21',
                Quantity: ''
            }];
            
            $scope.order.OrderDetails = $scope.orderDetails;
            $scope.submitOrder = function () {
                OrderService.AddOrder($scope.order).success(function (response) {
                    alert("提交成功！");

                    $state.go("home.orderList")
                });
            }

            /**
             * 获取客户信息
             */
            // function getCurrentCustomer() {
            //     CustomerService.getCurrentCustomer().success(function () {

            //     });
            // }
        }
    ]);
});