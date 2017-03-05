/**
 * Created by chenweizhi2 on 2016/12/26.
 */
define(['app',
    'resources/CollectListResource',
    'resources/TaskResource',
    'resources/ChannelResource',
], function (app) {

    var deps = ['$state', 'CollectListResource', 'TaskResource', 'ChannelResource'];

    function DetailRouteForWxService($state, CollectListResource, TaskResource, ChannelResource) {
        return {
            // 查询详情后判断该去往某个详情 应用于【评论通知】
            // contextId:上下文对象ID *
            // contextType:上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：声音：学员之声；7：好书：好书榜；8：好书：九三之声；*
            // TODO：未完成 6：声音：学员之声；
            // TODO:待各类型详情独立合并后去除
            goRouteUrl: function (contextId, contextType) {
                switch (contextType) {
                    case 1:
                        CollectListResource.getCollectionById(contextId).success(function (data) {
                            // 是否是负责人:directorState,是否已报名:participantsState
                            // 未报名
                            if (!data.directorState && !data.participantsState) {
                                $state.go("home.newCollectDetail", {collectId: contextId});
                            }
                            // 已报名
                            else if (!data.directorState && data.participantsState) {
                                $state.go("home.mEnrollCollectDetail", {collectionId: contextId});
                            }
                            // 我负责
                            else {
                                $state.go("home.myResponsibleCollectDetail", {collectionId: contextId});
                            }
                        });
                        break;
                    case 2:
                        $state.go("home.channelItemDetail", {itemId: contextId});
                        break;
                    case 3:
                        TaskResource.getSocialTaskDetailById(contextId).success(function (data) {
                            // 任务状态: 默认为0，0为进行中；1为完成【taskState】,用户报名状态：false为未报名  true1为已报名【userEnrollState】,当前用户是否为负责人 true为是 false为不是【userDirectorState】
                            // 已结束
                            if (data.taskState == 1) {
                                $state.go("home.endTaskDetail", {taskId: contextId});
                            }
                            // 我负责
                            else if (data.userDirectorState) {
                                $state.go("home.myResponsibleDetail", {taskId: contextId});
                            }
                            // 已报名
                            else if (data.userEnrollState) {
                                $state.go("home.mEnrollTaskDetail", {taskId: contextId});
                            }
                            // 未报名
                            else {
                                $state.go("home.newTaskDetail", {taskId: contextId});
                            }
                        });
                        break;
                    case 4:
                        $state.go("home.doctorTopicDetail", {topicId: contextId, contextType: 4});
                        break;
                    case 5:
                        $state.go("home.doctorTopicDetail", {topicId: contextId, contextType: 5});
                        break;
                    case 6:
                        $state.go("home.suggestionDetail", {topicId: contextId});
                        break;
                    case 7:
                        $state.go("home.bookView", {bookId: contextId});
                        break;
                    case 8:
                        $state.go("home.radioDetail", {radioId: contextId});
                        break;
                }
            }
        };
    }

    DetailRouteForWxService.$inject = deps;
    app.lazy.service("DetailRouteForWxService", DetailRouteForWxService);
});