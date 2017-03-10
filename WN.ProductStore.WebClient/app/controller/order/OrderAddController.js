/**
 * Created by linyuebin .
 */
define([
    "app.config",
    "jquery",
    "jqueryWeUI"
], function (app) {

    app.controller('OrderAddController', ['$scope', 'OrderService', '$state', '$stateParams',

        function ($scope, OrderService, $state, $stateParams) {

            $scope.order = {};
            var cars = $stateParams.cars;

            $scope.order.OrderDetails = cars;
            $scope.submitOrder = function () {
                OrderService.AddOrder($scope.order).success(function (response) {
                    $.toast("发布成功!");

                    $state.go("orderList")
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