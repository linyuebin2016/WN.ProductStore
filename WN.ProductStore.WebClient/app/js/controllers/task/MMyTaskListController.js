/**
 * Created by shengxiangyang on 2016-12-12.
 */
define(["app", "jquery", "jqueryWeUI",
    "resources/TaskResource",
    'directives/InfiniteScroll',
    "resources/CollectListResource",
    'services/GeolocationService'
], function (app, $, _) {
    var deps = ["$scope", "TaskResource", "$state", "CollectListResource", "GeolocationService"];

    function controller($scope, TaskResource, $state, CollectListResource, GeolocationService) {
        $scope.codeLogin().then(function () {

            //我负责的
            $scope.wfzdrwList = [];
            $scope.wfzdczyzList = [];
            //我报名的
            $scope.wbmdrwList = [];
            $scope.wbmdczyzList = [];
            //已结束的
            $scope.yjsrwList = [];
            $scope.yjsczyzList = [];

            $scope.taskUser = {
                taskId: null,
                clockAddress: null,
                longitude: null,
                latitude: null
            };

            queryWfzdList();
            queryWbmdList();
            queryYjsList();

            //我负责的
            function queryWfzdList() {
                $scope.wfzdrwList = [];
                $scope.wfzdczyzList = [];
                queryWfzdrwList();
                queryWfzdczyzList();
            }

            //我报名的
            function queryWbmdList() {
                $scope.wbmdrwList = [];
                $scope.wbmdczyzList = [];
                queryWbmdrwList();
                queryWbmdczyzList();
            }

            //已结束的
            function queryYjsList() {
                $scope.yjsrwList = [];
                $scope.yjsczyzList = [];
                queryYjsWfzdrwList();
                queryYjsWbmdrwList();
                queryYjsWfzdczyzList();
                queryYjsWbmdczyzList();
            }

            //我负责的任务列表
            function queryWfzdrwList() {
                TaskResource.getMyDirectorTaskList(null, 0, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.wfzdrwList.push(response[i]);
                        }
                    }
                });
            }

            //我负责的参政议政列表
            function queryWfzdczyzList() {
                CollectListResource.queryPrincipalCollectList(0, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.wfzdczyzList.push(response[i]);
                        }
                    }
                });
            }

            //我报名的任务列表
            function queryWbmdrwList() {
                TaskResource.getWbmdTaskList(null, 0, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.wbmdrwList.push(response[i]);
                        }
                    }
                });
            }

            //我报名的参政议政列表
            function queryWbmdczyzList() {
                CollectListResource.queryEnterCollectList(0, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.wbmdczyzList.push(response[i]);
                        }
                    }
                });
            }

            //已结束的-我负责的任务列表
            function queryYjsWfzdrwList() {
                TaskResource.getMyDirectorTaskList(null, 1, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.yjsrwList.push(response[i]);
                        }
                    }
                });
            }

            //已结束的-我报名的任务列表
            function queryYjsWbmdrwList() {
                TaskResource.getWbmdTaskList(null, 1, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.yjsrwList.push(response[i]);
                        }
                    }
                });
            }

            //已结束的-我负责的参政议政列表
            function queryYjsWfzdczyzList() {
                CollectListResource.queryPrincipalCollectList(1, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.yjsczyzList.push(response[i]);
                        }
                    }
                });
            }

            //已结束的-我报名的参政议政列表
            function queryYjsWbmdczyzList() {
                CollectListResource.queryEnterCollectList(1, 0, 0, 1, 1000).success(function (response) {
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            $scope.yjsczyzList.push(response[i]);
                        }
                    }
                });
            }

            //我负责的参政议政-提交
            $scope.submitWfzdczyz = function (wfzdczyz) {
                $.confirm("提交后将不能取消，确定提交这个征集？", "确认提交", function () {
                    CollectListResource.submitAuditCollection(wfzdczyz.collectionId).success(function (response) {
                        $.toast("已提交!");
                        getCollection(wfzdczyz);
                    });
                }, function () {
                    return false;
                });
            };

            //我负责的任务-开启打卡/继续打卡
            $scope.startClock = function (wfzdrw) {
                $state.go("home.openClock", {taskId: wfzdrw.taskId});
                getWfzdTaskVo(wfzdrw);
            };

            //我报名的任务-点击打卡
            $scope.rwBmrClock = function punchClock(wbmdrw) {
                getPosition(wbmdrw);
            };

            function getPosition(wbmdrw) {
                $.showLoading("正在定位");
                GeolocationService.getCurrentPosition().then(function (data) {
                    $.hideLoading();
                    serverPunchClock(data, wbmdrw);
                }, function (error) {
                    $.hideLoading();
                    $.toast(error.errorMsg, "forbidden");
                });
            }

            /** 服务端打卡 */
            function serverPunchClock(data, wbmdrw) {
                var address = data.latitude + "," + data.longitude;
                TaskResource.rwBmrClock(wbmdrw.taskId, wbmdrw.clockState, address).success(function (response) {
                    if (response.state == true || response.state == "true") {
                        $.toast('打卡成功!');
                        getWbmdTaskVo(wbmdrw);
                    } else {
                        $.toast('打卡失败，请确认您已到达现场。', "forbidden");
                    }
                }).error(function (error) {
                    $.toast('打卡出错：' + error, "forbidden");
                });
            }

            /**
             * 跳转到详情页面
             * @param type
             * @param taskId
             */
            $scope.queryItemById = function (type, taskId,task) {
                if (type == 0) {
                    $state.go("home.myResponsibleCollectDetail", {collectionId: taskId});
                } else if (type == 1) {
                    if(task.taskType==1){
                        $state.go("home.operationDetail", {activityId: taskId});
                    }else{
                        $state.go("home.myResponsibleDetail", {taskId: taskId});
                    }
                } else if (type == 2) {
                    $state.go("home.mEnrollCollectDetail", {collectionId: taskId});
                } else if (type == 3) {
                    if(task.taskType==1){
                        $state.go("home.operationDetail", {activityId: taskId});
                    }else {
                        $state.go("home.mEnrollTaskDetail", {taskId: taskId});
                    }
                }
            };

            /**
             * 获取我负责的征集的提交状态
             * @param wfzdczyz
             * @returns {*}
             */
            function getCollection(wfzdczyz) {
                CollectListResource.queryCollect(wfzdczyz.collectionId).success(function loaded(data) {
                    wfzdczyz.auditState = data.auditState;
                });
            }

            /**
             * 获取我负责的任务的打卡开启状态
             * @param wfzdrw
             */
            function getWfzdTaskVo(wfzdrw) {
                TaskResource.getSocialTaskDetailById(wfzdrw.taskId).success(function loaded(data) {
                    wfzdrw.taskClockState = data.taskClockState;
                });
            }

            /**
             * 获取我报名的任务的打卡开启状态
             * @param wbmdrw
             */
            function getWbmdTaskVo(wbmdrw) {
                TaskResource.getSocialTaskDetailById(wbmdrw.taskId).success(function loaded(data) {
                    wbmdrw.voteState = data.voteState;
                    wbmdrw.taskClockState = data.taskClockState;
                    wbmdrw.userClockState = data.userClockState;
                });
            }

            //页签
            changeTab();
            function changeTab() {
            $(document).on("click", ".weui_navbar > a", function() {
                $(this).siblings("a").removeClass("weui_bar_item_on").end().addClass("weui_bar_item_on");
                var index = $(".weui_navbar > a").index($(this));
                $(".weui_tab_bd .weui_tab_bd_item").eq(index).siblings(".weui_tab_bd .weui_tab_bd_item").removeClass("weui_tab_bd_item_active").end().addClass("weui_tab_bd_item_active");
              });

            }

        });
    }

    controller.$inject = deps;
    return app.lazy.controller("MMyTaskListController", controller);
});