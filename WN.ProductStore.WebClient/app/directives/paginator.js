define([
    "app.config"
], function (app) {
    app.directive('paginator', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                totalPage: '=totalPage',
                currentPage: '=currentPage',
                getData: '&getData'
            },
            templateUrl: 'views/page/paginator.html',
            controller: function ($scope) {
                $scope.firstPage = function () {
                    $scope.currentPage = 1;
                }
                $scope.lastPage = function () {
                    $scope.currentPage = $scope.totalPage;
                }
                $scope.prePage = function () {
                    $scope.currentPage--;
                }
                $scope.nextPage = function () {
                    $scope.currentPage++;
                }

                $scope.$watch('currentPage', function (newVal, oldVal) {
                    if (newVal != oldVal && newVal) $scope.getData();
                })
            }
        }

    }]);
});