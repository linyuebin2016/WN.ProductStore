/**
 * 多选组织树展示指令
 * Created by xiangshang on 2016/11/30.
 */
define(["app", "lodash"], function(app, _) {

    var deps = ["$window", "$timeout"];

    function directive($window, $timeout) {

        function parsePadding(padding){
            if (isNaN(parseInt(padding))){
                return 0;
            } else {
                return parseInt(padding);
            }
        }

        return {
            restrict: 'A',
            link: function($scope, ele, attrs) {
                ele.css("overflow", "auto");
                var padding = parsePadding(attrs.paddingtop) + parsePadding(attrs.paddingbottom);

                function calculateHeight() {
                    $timeout(function() {
                        ele.css("height", $window.document.documentElement.clientHeight - padding)
                    });
                }
                $window.addEventListener('resize', _.throttle(calculateHeight, 100));
                calculateHeight();
            }
        };
    }

    directive.$inject = deps;
    app.lazy.directive("adaptiveHeight", directive);
});
