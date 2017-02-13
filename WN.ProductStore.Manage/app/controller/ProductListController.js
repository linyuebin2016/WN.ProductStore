/**
 * Created by shengxiangyang on 2017-02-09.
 */
<<<<<<< HEAD
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
    }
]);
=======

angular.module('myApp').controller('ProductListController',['$scope','$route', '$log','$http',
    function($scope, $route, $log,$http){
        $scope.name = "dfdfd";
        $scope.res = getList();
        function getList() {
            //return $resource('http://10.52.0.87/ProductStroe/api/Product?pageIndex=0&pageSize=10&name=', {}, {
            //    query: {
            //        method: 'GET',
            //        params: {phoneId: 'phones'},
            //        isArray: true
            //    }
            //});
            $http.get("http://10.52.0.87/ProductStroe/api/Product?pageIndex=0&pageSize=10&name=")
                .success(function (response) {
                   return response;
                });
        }
    }]
);
>>>>>>> a42af8754235317296b42c8f5ea1d0fbf94bbb27
