/**
 * Created by linyuebin .
 */
define(function (require) {
    var app = require('../../app.config');

    app.controller('CarListController', ['$scope', 'CarService', '$state', 'baseImgServer',

        function ($scope, CarService, $state, baseImgServer) {
            $scope.baseImgServer = baseImgServer;
            $scope.cars = [];
            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.queryString = "";
            getCarList();

            function getCarList() {
                CarService.GetCarList($scope.pageIndex, $scope.pageSize, $scope.queryString).success(function (data) {
                    $scope.cars = data.List;
                });
            }

            $scope.pay = function () {
                $state.go("orderAdd");
            }

        }
    ]);
});