/**
 * Created by 林悦斌 on 2016-12-14.
 */
define([
    'app',
    'resources/TaskResource',
    'services/TipsService',
    "directives/CommentForWx",
    "directives/AReward",
    "services/BaseService",
    'services/DownloadFileService',
    'directives/UserImageForWx'
], function (app) {

    var deps = ['$scope', '$stateParams', 'TaskResource', 'UserService', 'TipsService', 'BaseService', 'DownloadFileService'];

    function controller($scope, $stateParams, TaskResource, UserService, TipsService, BaseService, DownloadFileService) {

        var currentUser = UserService.getCurrentUser();
        $scope.task = {};
        var taskId = $stateParams.taskId;
        if (!taskId) {
            TipsService.show('请先指定要查看的任务!');
        } else {
            getTask();
        }

        //获取新任务详情
        function getTask() {
            return TaskResource.getSocialTaskDetailById(taskId).success(function loaded(data) {
                $scope.task = data;
            });
        }

        //点赞
        $scope.taskPraise = function taskPraise(task) {
            TaskResource.setSocialTaskPraise(task.taskId).success(function (response) {
                task.praiseState = !task.praiseState;
                task.praiseCount = response;
            });
        };

        //关注
        $scope.attentionTask = function attentionTask(task) {
            TaskResource.setSocialTaskAttention(task.taskId).success(function (response) {
                task.attentionState = !task.attentionState;
                task.attentionCount = response;
            });
        };

        //下载附件
        $scope.downLoadAttach = function (attachsId, attachsName) {
            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attachsId;
            DownloadFileService.downloadFiletoDisk(url, attachsName);
        }
    }

    controller.$inject = deps;
    return app.lazy.controller('EndTaskDetailController', controller);
});