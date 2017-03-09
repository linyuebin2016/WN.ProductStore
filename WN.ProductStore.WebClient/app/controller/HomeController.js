/**
 * Created by shengxiangyang on 2017-02-10.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('HomeController', ['$scope', '$state', function ($scope, $state) {

        $state.go("home.carList");
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
            $state.go("home.orderList");
        }
    }]);
});