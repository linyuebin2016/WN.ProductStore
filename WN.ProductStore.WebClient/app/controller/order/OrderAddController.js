/**
 * Created by linyuebin .
 */
define(function (require) {
    var app = require('../../app.config');

    app.controller('OrderAddController', ['$scope', 'OrderService', '$state', 'CustomerService',
        function ($scope, OrderService, $state, CustomerService) {

            $scope.order = {};
            getOrderList();

            function getOrderList() {
                OrderService.AddOrder($scope.order).success(function (response) {
                    alert("提交成功！");
                });
            }

            /**
             * 获取客户信息
             */
            function getCurrentCustomer() {
                CustomerService.getCurrentCustomer().success(function () {

                });
            }
        }
    ]);
});