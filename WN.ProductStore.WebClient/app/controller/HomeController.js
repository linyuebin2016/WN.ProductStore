/**
 * Created by shengxiangyang on 2017-02-10.
 */
define([
    "app.config"
], function (app) {
    app.controller('HomeController', ['$scope', '$state', '$location', function ($scope, $state, $location) {

        var path = $location.path();

        if (path == "/home") {
            $state.go("home.homePage");
        }

        // 判断一级路由
        $scope.stateIsFirst = function (path) {
            var result= $state.current.name == path;
            return result;
        }

        $scope.classActive = "home11";

        $scope.goProductList = function () {
            $state.go("productList");
        }

        $scope.goCarList = function () {
            $state.go("home.carList");
        }

        $scope.goHomePage = function () {
            $state.go("home.homePage");
        }

        $scope.goTo = function (target) {
            $state.go(target);
        }

        $scope.goMyIndex = function () {
            $state.go("orderList");
        }
    }]);
});