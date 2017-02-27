/**
 * Created by shengxiangyang on 2016-12-08.
 */
define([
    'app',
    "jquery",
    "jqueryWeUI",
    'resources/TaskResource',
    "directives/CommentForWx",
    "directives/AReward",
    "services/BaseService",
    'services/DownloadFileService',
    'directives/UserImageForWx'
], function (app, $) {

    var deps = ['$scope', '$stateParams', 'TaskResource', 'BaseService', 'DownloadFileService'];

    function controller($scope, $stateParams, TaskResource,  BaseService, DownloadFileService) {

        //投票被选中的选项结果
        $scope.result = [];
        $scope.task = {};
        var taskId = $stateParams.taskId;
        if (!taskId) {
            $.toast('请先指定要查看的任务!');
        } else {
            getTask(0);
        }

        //获取新任务详情
        function getTask(type) {
            TaskResource.getSocialTaskDetailById(taskId).success(function loaded(data) {
                if (type == 1) {
                    $scope.task.voteItem = data.voteItem;
                    $scope.task.voteState = data.voteState;
                    $scope.task.userVoteState = data.userVoteState;
                    $scope.task.taskUsersName = data.taskUsersName;
                    $scope.task.voteFillCount = data.voteFillCount;
                    $scope.task.userEnrollState = data.userEnrollState;
                } else {
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
                }
                if (data.voteState) {
                    //当前用户已投票
                    if (data.userVoteState == 1) {
                        for (var j = 0; j < data.voteItem.length; j++) {
                            if (data.voteItem[j].userVoteState == 1) {
                                $scope.result.push(data.voteItem[j].itemId);
                            }
                        }
                    }
                }
            });
        }

        //判断投票选项选中的结果
        $scope.checkFlag = function checkFlag(id) {
            return $scope.result.indexOf(id) != -1;
        };

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
        $scope.downLoadAttach = function (attachId, attachName) {
            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attachId;
            DownloadFileService.downloadFiletoDisk(url, attachName);
        };

        //报名
        $scope.taskEnter = function taskEnter() {
            $.confirm("报名后将不能取消，确定报名这个任务？", "确认报名", function () {
                TaskResource.enrollSocialTask(taskId).success(function (response) {
                    if (response) {
                        getTask(1);
                        $.toast("已报名!");
                    }
                });
            }, function () {

            });
        };

        //投票
        $scope.taskVote = function saveQuest() {
            var checks = $("input[name='" + taskId + "']:checked");
            if (!checks || checks.length <= 0) {
                $.toast('请先选中投票项!');
                return;
            }
            var detailVo = {};
            detailVo.taskId = $scope.task.taskId;
            detailVo.voteId = $scope.task.voteId;
            detailVo.voteItem = [];
            for (var i = 0; i < checks.length; i++) {
                detailVo.voteItem.push({itemId: checks[i].id});
            }
            TaskResource.voteSocialTask(detailVo).success(function (data) {
                if (!data.state) {
                    $.toast('投票失败!');
                    return false;
                } else {
                    getTask(1);
                    $.toast('投票成功!');
                }
            });
        }

    }

    controller.$inject = deps;
    return app.lazy.controller('NewTaskDetailController', controller);
});

