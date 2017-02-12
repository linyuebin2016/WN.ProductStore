/**
 * Created by shengxiangyang on 2017-02-09.
 */

angular.module('myApp').controller('ProductListController', ['$scope', '$route', '$log', '$http',
    function ($scope, $route, $log, $http) {
        $scope.name = "product!!!";
        $scope.res = getList();

        function getList() {
            // return $resource('http://10.52.0.87/ProductStroe/api/Product?pageIndex=0&pageSize=10&name=', {}, {
            //     query: {
            //         method: 'GET',
            //         params: {phoneId: 'phones'},
            //         isArray: true
            //     }
            // });

        }
        $scope.num = 0;
        var products = [{
            id: 1,
            name: 'Phone1'
        }, {
            id: 2,
            name: 'Phone2'
        }, {
            id: 3,
            name: 'Phone3'
        }, ]

        $scope.productList = products;
    }
]);