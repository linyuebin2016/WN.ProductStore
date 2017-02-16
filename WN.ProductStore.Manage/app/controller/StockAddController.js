/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('StockAddController', ['$scope', 'StockService', '$stateParams',
        function ($scope, StockService, $stateParams) {


            $scope.product = $stateParams.product;
            $scope.stockId = $stateParams.stockId;
            $scope.quantity = 1;

            /**保存库存 */
            $scope.save = function () {
                if ($scope.quantity < 0) {
                    alert("数量不能小于0")
                    return;
                }
                StockService.SaveStock($scope.product.Id, $scope.quantity, $scope.stockId).success(function (response) {
                    alert("保存成功！");
                    window.history.back();
                });
            }
        }
    ]);
});