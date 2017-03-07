/**
 * Created by shengxiangyang on 2017-02-10.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('HomeController', ['$scope', '$state',function ($scope,$state) {

        $scope.goProductList=function(){
            $state.go("productList");
        }
    }]);
});