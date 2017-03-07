/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('CustomerController', ['$scope', 'CustomerService', '$state',
        function ($scope, CustomerService, $state) {
            $scope.queryString = "";
            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.pageList = [];

            function getCustomerList() {
                CustomerService.GetCustomerList($scope.pageIndex, $scope.pageSize, $scope.queryString).success(function (response) {
                    $scope.customers = response.ProductStockList;
                    $scope.pageCount = Math.ceil(response.TotalCount / 10);

                    for (var i = 0; i < $scope.pageCount; i++) {
                        $scope.pageList.push(i + 1);
                    }
                });
            }
            getCustomerList();
            $scope.seach = function () {
                getCustomerList();
            }
             //修改客户
            $scope.modifyCustomer = function (customerid) {
                $state.go("customerAdd", {
                    customerid: customerid
                });
            };

       
            $scope.selectPage = function (page) {
debugger;
                //因为只显示5个页数，大于2页开始分页转换
                $scope.Stocks = [];
                CustomerService.GetCustomerList(page, $scope.pageSize, $scope.queryString).success(function (response) {
                    $scope.customers = response.ProductStockList;
                });
            };

            //上一页
            $scope.Previous = function () {
                $scope.selectPage($scope.selPage - 1);
            }
            //下一页
            $scope.Next = function () {
                $scope.selectPage($scope.selPage + 1);
            };

           

            $scope.Delete = function (id) {
                CustomerService.DeleteCustomer(id).success(function (resultJson) {
                    alert(resultJson + "删除成功");
                     getCustomerList();
                }).error(function (e) {
                    console.log('系统异常');
                });


            }

        }
    ]);
});