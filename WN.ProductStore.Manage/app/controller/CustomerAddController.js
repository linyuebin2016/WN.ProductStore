/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('CustomerAddController', ['$scope', 'CustomerService', '$state',
        function ($scope, CustomerService, $state) {
       
            $scope.customer;
    
             $scope.save = function() {
       
                CustomerService.SaveCustomer($scope.customer).success(function (resultJson) {
                    alert("新增成功!");
                    window.history.back();
                }).error(function (e) {
                    console.log('系统异常');
                });
            };
        }
    ]);
});