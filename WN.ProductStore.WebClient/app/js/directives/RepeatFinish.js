/**
 * Created by chenweizhi2 on 2016/12/16.
 */
define(["app"], function (app) {

    var deps = [];

    function directive() {
        return {
            link: function ($scope, elem, attr) {
                if ($scope.$last) {
                    $scope.$eval(attr.fcRepeatFinish);
                }
            }
        };
    }

    directive.$inject = deps;
    return app.lazy.directive("fcRepeatFinish", directive);
});