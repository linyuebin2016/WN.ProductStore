 define([
     "app.config"
 ], function (app) {
     app.directive('paginator', ["$window", "$document", "$timeout", function ($window, $document, $timeout) {
         return {
             link: function ($scope, elem, attrs) {

                 var $target = getTarget(),
                     fn = $scope.$eval(attrs.fcInfiniteScroll),
                     lengthThreshold = attrs.scrollThreshold || 50,
                     timeThreshold = attrs.timeThreshold || 300,
                     promise;

                 $target.on("scroll", handler);

                 $scope.$on("$destroy", function () {
                     $target.off("scroll", handler);
                 });

                 $scope.$watch(attrs.fcInfiniteScroll, function (handler) {
                     fn = handler;
                 });

                 function handler() {
                     if (fn && shouldScroll()) {
                         if (promise) {
                             return;
                         }
                         // 进行加载
                         fn();
                         // 在时限内, 不再给加载了.
                         promise = $timeout(function () {
                             promise = null;
                         }, timeThreshold);
                     }
                 }

                 function shouldScroll() {
                     if ($target[0] === $window) {
                         if ($document.scrollTop() == 0) { //还未开始移
                             return false;
                         }
                         return $document.height() - $target.height() - $document.scrollTop() < lengthThreshold;
                     }
                     return $target.prop("scrollHeight") - $target.height() - $target.scrollTop() < lengthThreshold;
                 }

                 function getTarget() {
                     if (attrs.target == null) {
                         return elem;
                     }
                     if (attrs.target === "parent") {
                         return elem.parent();
                     }
                     if (attrs.target === "window") {
                         return angular.element($window);
                     }
                     return elem;
                 }
             }
         }

     }]);
 });