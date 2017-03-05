/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('CustomerAddController', ['$scope', 'CustomerService', '$state', '$stateParams',
        function ($scope, CustomerService, $state, $stateParams) {

            $scope.isEdit = false;
            var customerid = $stateParams.customerid;
            $scope.customer;

            $scope.save = function () {

                CustomerService.SaveCustomer($scope.customer).success(function (resultJson) {
                    alert("新增成功!");
                    window.history.back();
                }).error(function (e) {
                    console.log('系统异常');
                });


            };
            $scope.update = function () {
                CustomerService.UpdateCustomer($scope.customer).success(function (resultJson) {
                    alert("更新成功!");
                    window.history.back();
                }).error(function (e) {
                    console.log('系统异常');
                });


            }

            if (customerid != null && customerid != "") {
                $scope.isEdit = true;
                GetDetail(customerid);
            }

            function GetDetail(customerid) {
                CustomerService.GetDetail(customerid).success(function (response) {
                    $scope.customer = response;

                });
            }


        }
    ]);
});