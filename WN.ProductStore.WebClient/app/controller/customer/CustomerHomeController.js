/**
 * Created by linyuebin
 */
define([
    "app.config"
], function (app) {


    app.controller('CustomerHomeController', ['$scope', 'CustomerService', '$state', '$stateParams',
        function ($scope, CustomerService, $state, $stateParams) {

            //修改客户
            $scope.goTo = function (path) {
                $state.go(path);
            };
            $scope.model = {};
            getCustomer();

            function getCustomer() {
                CustomerService.getCurrentCustomer().success(function (data) {
                    $scope.model = data;
                });
            }
        }
    ]);
});