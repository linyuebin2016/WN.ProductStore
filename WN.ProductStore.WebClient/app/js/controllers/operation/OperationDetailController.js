define([
    'app',
    "jquery",
    'lodash',
    'resources/OperationalActivityResource',
    "services/BaseService",
    "directives/CommentForWx",
    'services/DownloadFileService',
    'services/GeolocationService',
    'services/UserService'
], function (app, $, _) {

    var deps = ['$scope', '$state', '$stateParams', 'OperationalActivityResource', 'UserService', "BaseService", "DownloadFileService",'GeolocationService'];

    function controller($scope, $state, $stateParams, OperationalActivityResource, UserService,BaseService, DownloadFileService,GeolocationService) {
    	/**返回 */
        $scope.goBack = function goBack() {
        	window.history.back();
        }
        //处理常见类型的文件图标显示
        $scope.checkFileType = DownloadFileService.checkFileType;

    	var currentUser = UserService.getCurrentUser();
        $scope.task = {};
        $scope.task.praiseClass="ico-btn";
        $scope.task.attentionClass="ico-btn";
        $scope.showPersonList=true;
        $scope.drawEnd=false;
        var activityId = $stateParams.activityId;
        if (!activityId) {
            $.toast("请先指定要查看运营!", "text");
        } else {
        	getTask();
        }
        $scope.clockName="开始打卡";

        function getTask() {        	
            return OperationalActivityResource.queryOperationalActivity(activityId,1).success(function loaded(data) {
                $scope.task = data;
                if($scope.task.rewardWinners==undefined || $scope.task.rewardWinners==null){
                    $scope.showPersonList=false;
                }else {
                    if($scope.task.lotteryNumber>$scope.task.rewardWinners.length){
                        $scope.drawIndex=$scope.task.rewardWinners.length+1;
                        $scope.lunciTest=$scope.drawIndexStr[$scope.drawIndex];
                        $scope.drawEnd=false;
                    }else{
                        $scope.drawEnd=true;
                    }
                }
                //封面图片
                $scope.task.picUrl=BaseService.restfulUrl + 'fileUploadController/showPic/' + $scope.task.picId;

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
                if(data.taskClockState==0){
                    $scope.clockName="开始打卡";
                }else if(data.taskClockState==1){
                    $scope.clockName="结束打卡";
                }else if(data.taskClockState==2){
                    $scope.clockName="开始打卡";
                }
                
                //任务内容
                $scope.task.info = $scope.task.info.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
            });
        }
        
        /**点赞 */
        $scope.taskPraise = function taskPraise() {
            OperationalActivityResource.setOperationalPraise(activityId).success(function (response) {
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
            OperationalActivityResource.setOperationalAttention(activityId).success(function (response) {
                $scope.task.attentionCount = response;
                $scope.task.attentionState = !$scope.task.attentionState;
                $scope.task.attentionClass = "icon-btn-big";
                if ($scope.task.attentionState) {
                    $scope.task.attentionClass = "icon-btn-big active";
                }
            });
        }
        
        //转到任务
        $scope.toTask = function toTask(item) {
        	var url="home.newTaskDetail";
        	if (item.directorState==true) {
        		 url="home.myResponsibleDetail";
        	} else if (item.enrollState==true) {
        		 url="home.mEnrollTaskDetail";
        	}            	
            $state.go(url, {
                taskId: item.taskId
            });
        }
        
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
        $scope.drawIndex=1;
        $scope.drawIndexStr=['零','一','二','三','四','五','六','七','八','九','十','十一','十二'];
        $scope.lunciTest="一";
        //打卡按钮
        $scope.clock=function (type) {
            if($scope.task.userDirectorState && type==0) {//负责人打卡
                $state.go("home.drawClock", {drawId: activityId});
            }
            else{//参与人打卡
                getPosition();
            }
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
            OperationalActivityResource.setActivityUserClock(activityId, $scope.task.userClockState, address).success(function (response) {
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

        //抽奖按钮
        $scope.doDraw=function () {
            if($scope.task.taskClockState==2 ) {
                $.confirm("", "确定开始第" + $scope.lunciTest + "轮抽奖？", function () {
                    OperationalActivityResource.setOperationalActivityAwardUser(activityId, $scope.drawIndex).success(function (resp) {
                        if (resp && resp.length > 0) {
                            $scope.drawIndex = $scope.drawIndex + 1;
                            $scope.lunciTest = $scope.drawIndexStr[$scope.drawIndex];
                            $state.go("home.drawPersonList", {drawId: activityId,directorState:$scope.task.userDirectorState});
                        } else {
                            $.toast('抽奖失败!');
                        }
                    });
                });
            }
        }
        //抽奖人员列表
        $scope.toDrawPersonList=function () {
            $state.go("home.drawPersonList",{drawId:activityId,directorState:$scope.task.userDirectorState});
        }

        /** 报名*/
        $scope.signUp = function signUp() {
            $.confirm("", "报名后不能取消，确定报名？", function() {
                OperationalActivityResource.enrollOperational(activityId).success(function (response) {
                    getTask();
                });
            });
        }
    }

    controller.$inject = deps;
    return app.lazy.controller('OperationDetailController', controller);
});
