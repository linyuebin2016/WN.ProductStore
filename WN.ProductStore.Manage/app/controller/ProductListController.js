/**
 * Created by shengxiangyang on 2017-02-09.
 */
angular.module('myApp').controller('ProductListController',['$scope','$route', '$log','$http',
    function($scope, $route, $log,$http){
        $scope.name = "dfdfd";
         getList();
        function getList() {
            $http.get("http://10.52.0.87/ProductStroe/api/Product/GetProductList?pageIndex=0&pageSize=10&name=")
                .success(function (response) {
                    $scope.productList = response.Products;
            });
        }
    }]
);
