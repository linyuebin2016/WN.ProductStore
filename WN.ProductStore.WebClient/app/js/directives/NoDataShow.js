/**
 * Created by zhuyunfeng on 2017/1/20.
 */
define(['app'
], function (app, _) {

    var deps = ["BaseService"];

    function directive(BaseService) {
        return {
            restrict: 'EA',
            templateUrl: 'views/common/NoDataShow.html',
            replace: true,
            scope: {
                length: '=?',
                showLine:'=?'
            },
            link: function ($scope) {
                $scope.showThis = false;
                $scope.showTopLine=true;
                if($scope.showLine==0){
                    $scope.showTopLine=false;
                }
                $scope.$watch("length", function () {
                    if ($scope.length && $scope.length > 0) {
                        $scope.showThis = false;
                    }
                    else {
                        $scope.showThis = true;
                    }
                });

            }
        };
    }


    directive.$inject = deps;
    return app.lazy.directive('fcNoDataShow', directive);
});