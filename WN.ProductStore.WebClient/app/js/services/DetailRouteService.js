/**
 * Created by chenweizhi2 on 2016/12/26.
 */

define(['app',
    'resources/CollectListResource',
    'resources/TaskResource',
    'resources/ChannelResource',
], function (app) {

    var deps = ['$state', 'CollectListResource', 'TaskResource', 'ChannelResource'];

    function DetailRouteService($state, CollectListResource, TaskResource, ChannelResource) {
        return {
            // 查询详情后判断该去往某个详情 应用于【评论通知】
            // contextId:上下文对象ID *
            // contextType:上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：声音：学员之声；*
            // TODO：未完成 4：互助：求医问药；6：声音：学员之声；
            // TODO:待各类型详情独立合并后去除
            goRouteUrl: function (contextId, contextType) {
                switch (contextType) {
                    case 1:
                        $state.go("home.CollectDetailController", {collectId: contextId});
                        break;
                    case 2:
                        $state.go("home.channel.channelItemView", {itemId: contextId});
                        break;
                    case 3:
                        TaskResource.getSocialTaskDetailById(contextId).success(function (data) {
                            // 任务状态: 默认为0，0为进行中；1为完成【taskState】,用户报名状态：false为未报名  true1为已报名【userEnrollState】,当前用户是否为负责人 true为是 false为不是【userDirectorState】
                            // 我负责
                            if (data.userDirectorState) {
                                $state.go("home.task.responsibleTaskDetail", {taskId: contextId});
                            }
                            // 已报名
                            else if (data.userEnrollState) {
                                $state.go("home.task.enrollTaskDetail", {taskId: contextId});
                            }
                            // 未报名
                            else {
                                $state.go("home.task.newTaskDetail", {taskId: contextId});
                            }
                        });
                        break;
                }
            }
        };
    }

    DetailRouteService.$inject = deps;
    app.lazy.service("DetailRouteService", DetailRouteService);
});