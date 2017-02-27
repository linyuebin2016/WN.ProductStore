/**
 * Created by shengxiangyang on 2016-12-13.
 */
define([
    'app',
    'resources/TaskResource',
    "directives/CommentForWx",
    "directives/AReward",
    "services/BaseService",
    'services/DownloadFileService',
    'directives/UserImageForWx'
], function (app) {

    var deps = ['$scope', '$state', '$stateParams', 'TaskResource',  "BaseService", "DownloadFileService"];

    function controller($scope, $state, $stateParams, TaskResource,  BaseService, DownloadFileService) {
        $scope.codeLogin().then(function () {
        $scope.task = {};
        var taskId = $stateParams.taskId;
        getTask(0);

        function getTask(type) {
            TaskResource.getSocialTaskDetailById(taskId).success(function loaded(data) {
                if (type==1){
                    $scope.task.taskClockState = data.taskClockState;
                } else {
                    // 加全路径
                    $scope.task.taskContent = data.taskContent.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
                    // <a>标签替换
                    var urls = $scope.task.taskContent.match(/<a.*?href=.*?>/g);
                    if (urls) {
                        var replaceUrls = [];
                        for (var i = 0; i < urls.length; i++) {
                            var url = urls[i].match(/<a.*?href=".*?"/)[0].replace(/<a.*?href="/, '').replace(/"/, '');
                            url = "<a href=" + "javascript:openWindow('" + url + "') class='hand'>";
                            replaceUrls.push(url);
                        }
                        for (var i = 0; i < urls.length; i++) {
                            $scope.task.taskContent = $scope.task.taskContent.replace(urls[i], replaceUrls[i]);
                        }
                    }
                    $scope.task = data;
                }
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
        $scope.downLoadAttach = function downLoadAttach(attachId,attachName) {
            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attachId;
            DownloadFileService.downloadFiletoDisk(url, attachName);
        };

        //查看已打卡的人
        $scope.goUsersClock = function goUsersClock() {
            $state.go("home.taskUsersClockCount", {taskId:taskId});
        };

        //开启打卡
        $scope.startClock = function (taskId) {
            getTask(1);
            $state.go("home.openClock", {taskId:taskId});
        }
    })
    }
    
    controller.$inject = deps;
    return app.lazy.controller('MyResponsibleDetailController', controller);

});

