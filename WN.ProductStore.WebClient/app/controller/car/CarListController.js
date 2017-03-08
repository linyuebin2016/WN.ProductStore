/**
 * Created by linyuebin .
 */
define(function (require) {
    var app = require('../../app.config');

    app.controller('CarListController', ['$scope', 'OrderService', '$state',
        function ($scope, OrderService, $state) {

            $scope.cars = [];

            function getCarList(){
                
            }
 
        }
    ]);
});