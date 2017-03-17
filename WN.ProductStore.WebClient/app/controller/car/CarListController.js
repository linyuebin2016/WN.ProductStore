/**
 * Created by linyuebin .
 */
define([
    "app.config"
], function (app) {

    app.controller('CarListController', ['$scope', 'CarService', '$state', 'baseImgServer',

        function ($scope, CarService, $state, baseImgServer) {
            $scope.baseImgServer = baseImgServer;
            $scope.cars = [];
            $scope.selected = [];
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
                $state.go("orderAdd", {
                    cars: $scope.selected
                });
            }

            $scope.isChecked = function (id) {
                return $scope.selected.indexOf(id) >= 0;
            };

            //**选择事件 */
            $scope.updateSelection = function ($event, car) {
                var checkbox = $event.target;
                var checked = checkbox.checked;
                var OrderDetail = {
                    ProductId: car.ProductId,
                    Quantity: car.Quantity
                }
                if (checked) {
                    $scope.selected.push(OrderDetail)
                } else {
                    var idx = $scope.selected.indexOf(OrderDetail);
                    $scope.selected.splice(idx, 1);
                }
            }

            $scope.selectAll = function () {
                // $scope.cars

            }

        }
    ]);
});