/**
 * Created by shengxiangyang on 2017-01-06.
 */
define([
    'app',
    "jquery",
    "jqueryWeUI",
    'resources/TaskResource',
    "directives/CommentForWx",
    "services/BaseService",
    'directives/UserImageForWx'
], function (app, $) {

    var deps = ['$scope', '$stateParams', 'TaskResource', 'BaseService'];

    function controller($scope, $stateParams, TaskResource,  BaseService) {

        $scope.task = {};
        var taskId = $stateParams.taskId;

        //获取新任务详情
        function getTask() {
            TaskResource.getSocialTaskDetailById(taskId).success(function loaded(data) {
                $scope.task = data;
                if (data.voteState) {
                    //问卷类型名
                    $scope.task.voteTypeName = "单选";
                    if (data.voteType == 1) {
                        $scope.task.voteTypeName = "多选";
                    }
                }
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

        getTask();
    }

    controller.$inject = deps;
    app.lazy.controller('DynamicTaskDetailController', controller);
});

