define([
    'app',
    "jquery",
    "jqueryWeUI",
    'resources/TaskResource',
    "directives/CommentForWx",
    "directives/AReward",
    "services/BaseService",
    'services/DownloadFileService',
    'services/GeolocationService',
    'services/UserService',
    'directives/UserImageForWx'
], function (app, $, _) {

    var deps = ['$scope', '$state', '$stateParams', 'TaskResource', 'UserService', "BaseService", "DownloadFileService", 'GeolocationService'];

    function controller($scope, $state, $stateParams, TaskResource, UserService, BaseService, DownloadFileService, GeolocationService) {
        /**返回  */
        $scope.goBack = function goBack() {
            window.history.back();
        }
        //处理常见类型的文件图标显示
        $scope.checkFileType = DownloadFileService.checkFileType;

        //setTimeout(function () {$("body").css("background","#fff");},200);

        var currentUser = UserService.getCurrentUser();
        $scope.task = {};
        $scope.task.selfSubmitMaterialVo = [];
        $scope.task.praiseClass = "icon-btn-big";
        $scope.task.attentionClass = "icon-btn-big";
        var taskId = $stateParams.taskId;
        if (!taskId) {
            $.toast('请先指定要查看的任务!', "forbidden");
        } else {
            getTask();
        }
        function getTask() {
            return TaskResource.getSocialTaskDetailById(taskId).success(function loaded(data) {
                $scope.task = data;
                //打卡信息
                if (data.taskState == 0 && data.clockState > 0) {
                    if (data.userClockState == 1) {
                        $scope.task.clockInfo = 2;
                    } else {
                        if (data.taskClockState == 0) {
                            $scope.task.clockInfo = 0
                        } else if (data.taskClockState == 1) {
                            $scope.task.clockInfo = 1;
                        } else {
                            $scope.task.clockInfo = 3;
                        }
                    }
                }

                //问卷类型名
                $scope.task.voteTypeName = "单选";
                $scope.task.voteClass = "weui_cells weui_cells_radio weui_cells_tuopiao";
                if (data.voteType == 1) {
                    $scope.task.voteTypeName = "多选";
                    $scope.task.voteClass = "weui_cells weui_cells_checkbox weui_cells_tuopiao";
                }

                //当前用户已投票                
                if ($scope.task.userVoteState == 1) {
                    $scope.selectVoteIds = "";
                    for (var k = 0; k < data.voteItem.length; k++) {
                        if (data.voteItem[k].userVoteState == 1) {
                            $scope.selectVoteIds = $scope.selectVoteIds + ",#" + data.voteItem[k].itemId;
                        }
                    }
                    if (!($scope.selectVoteIds == "")) {
                        $scope.selectVoteIds = $scope.selectVoteIds.substr(1);
                        setTimeout(function () {
                            $($scope.selectVoteIds).attr('checked', 'true');
                        }, 200);
                    }
                }

                //点赞
                $scope.task.praiseClass = "icon-btn-big";
                if (data.praiseState) {
                    $scope.task.praiseClass = "icon-btn-big active";
                }
                //关注
                $scope.task.attentionClass = "icon-btn-big";
                if (data.attentionState) {
                    $scope.task.attentionClass = "icon-btn-big active";
                }

                //本人提交的材料
                $scope.task.selfSubmitMaterialVo = [];
                if (data.submitMaterialVo) {
                    for (var i = 0; i < data.submitMaterialVo.length; i++) {
                        if (data.submitMaterialVo[i].createUserId == currentUser.userId) {
                            $scope.task.selfSubmitMaterialVo.push(data.submitMaterialVo[i]);
                        }
                    }
                }

                //任务内容
                $scope.task.taskContent = $scope.task.taskContent.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);

            });
        }

        /**点赞 */
        $scope.taskPraise = function taskPraise() {
            TaskResource.setSocialTaskPraise(taskId).success(function (response) {
                $scope.task.praiseCount = response;
                $scope.task.praiseState = !$scope.task.praiseState;
                $scope.task.praiseClass = "icon-btn-big";
                if ($scope.task.praiseState) {
                    $scope.task.praiseClass = "icon-btn-big active";
                }
            });
        }
        /**关注 */
        $scope.taskAttention = function taskAttention() {
            TaskResource.setSocialTaskAttention(taskId).success(function (response) {
                $scope.task.attentionCount = response;
                $scope.task.attentionState = !$scope.task.attentionState;
                $scope.task.attentionClass = "icon-btn-big";
                if ($scope.task.attentionState) {
                    $scope.task.attentionClass = "icon-btn-big active";
                }
            });
        }

        //以下打卡
        /**打卡 */
        $scope.punchClock = function punchClock() {
            getPosition();
        }

        function getPosition() {
            $.showLoading("正在定位");
            GeolocationService.getCurrentPosition().then(function (data) {
                //alert(data.latitude);
                //alert(data.longitude);
                $.hideLoading();
                serverPunchClock(data);
            }, function (error) {
                $.hideLoading();
                $.toast(error.errorMsg, "forbidden");
            });
        }

        /** 服务端打卡 */
        function serverPunchClock(data) {
            var address = data.latitude + "," + data.longitude;
            TaskResource.rwBmrClock($scope.task.taskId, $scope.task.clockState, address).success(function (response) {
                if (response.state == true || response.state == "true") {
                    getTask();
                    $.toast('打卡成功!')
                } else {
                    $.toast('打卡失败，请确认您已到达现场。', "forbidden");
                }
            }).error(function (error) {
                $.toast('打卡出错：' + error, "forbidden");
            });
        }

        //以下提交材料

        //下载附件
        $scope.downLoadAttach = function downLoadAttach(attachsId, attachsName) {
            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attachsId;
            DownloadFileService.downloadFiletoDisk(url, attachsName);
        }

        //附件预览
        $scope.attachView = function attachView(attachsId, attachsName, attachsType) {
            //跳转到预览页面
            var attachURL = '';
            if (attachsType == "pdf" || attachsType == "jpg" || attachsType == "png") {
                $state.go("home.attachView", {attachURL: attachsId, type: attachsType});
            }
            else {
                $scope.downLoadAttach(attachsId, attachsName);
            }
        }

    }

    controller.$inject = deps;
    return app.lazy.controller('mEnrollTaskDetailController', controller);
});
