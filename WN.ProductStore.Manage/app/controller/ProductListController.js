/**
 * Created by shengxiangyang on 2017-02-09.
 */

angular.module('myApp').controller('ProductListController',['$scope','$route', '$log','$http','$resource',
    function($scope, $route, $log,$http,$resource){
        $scope.name = "dfdfd";
        $scope.res = getList();
        function getList() {
            return $resource('http://10.52.0.87/ProductStroe/api/Product?pageIndex=0&pageSize=10&name=', {}, {
                query: {
                    method: 'GET',
                    params: {phoneId: 'phones'},
                    isArray: true
                }
            });
        }
    }]
);
