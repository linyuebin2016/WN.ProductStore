/**
 * Created by qiushaohua on 14-4-3.
 */
define(["app",
    "services/user/UserNoticeService",
    "filters/Moment",
    "directives/discuss/DiscussDetailPopup",
    "directives/share/ShareDetailPopup"
], function (app) {

    var deps = ["UserNoticeService"];

    function directive(UserNoticeService) {
        return {
            templateUrl: "93home/views/user/UserNotice.html",
            replace: true,
            scope: {
                notices: "=fcUserNotice",
                userMessages: "=",
                userId: "@?",
                title: "@?",
                userIcon: "@?"
            },
            link: function ($scope) {

                $scope.markAsRead = function(item,notice,contextId) {
                    UserNoticeService.markAsRead(item,notice,contextId);
                };

                $scope.markAllAsRead = function() {
                    if ($scope.userId) {
                        // 只清除对应用户的
                        UserNoticeService.markAllAsRead($scope.userId);
                    } else {
                        // 清除所有的
                        UserNoticeService.markAllAsRead();
                    }
                };

                //跳转到空间首页
                $scope.toSpaceHome = function (notice){
                    $scope.markAsRead(notice);
                    var spaceId = notice.contextId;
                    if(spaceId && spaceId.length>0){
                        $scope.$emit("space.goto.home", spaceId);
                    }
                };

                // 调到任务列表
                $scope.toTasks = function(){
                    $scope.$emit("menu.goto.tasks", 4);
                    UserNoticeService.markAllAsRead_task();
                };

                /**
                 * 通过 noteType 转换为对应的文字描述
                 * @return  noteTypeStr
                 * */
                $scope.convertNoteTypeToStr = function (noteType) {
                    var noteTypeStr;
                    switch (noteType) {
                        case 1 :
                            noteTypeStr = "给您安排了任务";
                            break;
                        // 变更负责人
                        case 2 :
                            noteTypeStr = "变更了";
                            break;
                        // 调整进度
                        case 3 :
                            noteTypeStr = "调整了";
                            break;
                        // 完成任务
                        case 4 :
                            noteTypeStr = "完成了";
                            break;
                        case 5 :
                            noteTypeStr = "暂停了任务";
                            break;
                        case 6 :
                            noteTypeStr = "重启了任务";
                            break;
                        case 7 :
                            noteTypeStr = "催办任务";
                            break;
                        case 9 :
                            noteTypeStr = "过期提醒";
                            break;
                        case 12 :
                            noteTypeStr = "添加了";
                            break;
                        case 13 :
                            noteTypeStr = "删除了";
                            break;
                    }
                    return noteTypeStr;
                };
            }
        };
    }

    directive.$inject = deps;
    return app.lazy.directive("fcUserNotice", directive);
});