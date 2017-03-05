/**
 * Created by xiaojianyong on 2017/1/5.
 */
define(["app"], function(app) {

    var deps = ["$scope"];

    function directive($scope) {
        return {
            restrict: 'E',
            replace: true,
            template: '<img src="">',
            link: function (scope, elem, attr) {
                $scope.$watch('per', function (nowVal) {
                    elem.attr('src', nowVal);
                })
            }
        };
    }
        directive.$inject = deps;
        app.lazy.directive("wxImg", directive);
    });