/**
 * Created by shengxiangyang on 2017-02-10.
 */
angular.module('myApp').controller('HomeController',['$scope','$route', '$log','$http','$state',
    function($scope, $route, $log,$http, $state){
        $scope.name = "dfdfd";

        $scope.aa = function () {
            $state.go("#!product");
        };
        function getList() {
            $http.get("http://10.52.0.87/ProductStroe/api/Product/GetProductList?pageIndex=0&pageSize=10&name=")
                .success(function (response) {
                    $scope.res = response;
                });
        }
    }]
);
