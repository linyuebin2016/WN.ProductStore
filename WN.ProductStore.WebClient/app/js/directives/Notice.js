/**
 * Created by xiaojianyong on 2017/2/23.
 */

define(['app',
    'resources/NoticeResource',
], function(app, _ ) {

    var deps = ['$state',"NoticeResource"];

    function directive( $state, NoticeResource) {
        return {
            restrict: 'EA',
            templateUrl: 'views/notice/noticeDing.html',
            replace: true,
            scope: {

            },
            link: function($scope) {
                //得到通知数
                function getNoticeNum() {
                    NoticeResource.countUserNotice().success(function (data) {
                        $scope.noticeNum = data;
                    });
                }
                getNoticeNum();

                //到通知列表
                $scope.goNotice = function(){
                    $state.go("home.notice");
                }
            }
        };
    }


    directive.$inject = deps;
    return app.lazy.directive('fcNotice', directive);
});

