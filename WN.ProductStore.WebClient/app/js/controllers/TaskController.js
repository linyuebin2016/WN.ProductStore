define(["app",
    "jquery",
    "swiper",
    "directives/Notice",
    'directives/InfiniteScroll',
    'directives/RepeatFinish',
    "filters/Moment",
    "resources/TaskResource",
    "resources/CollectListResource",
    "resources/OperationalActivityResource"
], function (app) {

    "use strict";

    var deps = ["$scope", "$state", 'TaskResource', 'CollectListResource', 'OperationalActivityResource'];

    function controller($scope, $state, TaskResource, CollectListResource, OperationalActivityResource) {

        /* 广告轮播 begin */

        $scope.advertisementList = [];

        queryAdvertisement(1);
        //获得广告列表  1.轮播 2.置顶 包括征集置顶
        function queryAdvertisement(showType) {
            //获得置顶征集
            CollectListResource.queryTopCollect().success(function (resp) {
                if (resp && resp.collectionPic) {
                    $scope.advertisementList.push(
                        {
                            imgUrl: $scope.baseUrl + "fileUploadController/showPic/" + resp.collectionPic + "?&picType=1",
                            activityId: resp.collectionId,
                            activityName: resp.collectionName,
                            status: 0,
                            type: 'collect'
                        });
                }
                OperationalActivityResource.getAdvertisementList(showType).success(function (resp) {
                    if (resp) {
                        for (var i = 0; i < resp.length; i++) {
                            if (resp[i].status == 0) {
                                resp[i].imgUrl = $scope.baseUrl + "fileUploadController/showPic/" + resp[i].picId + "?&picType=1";
                                resp[i].type = 'activity';
                                $scope.advertisementList.push(resp[i]);
                            }
                        }
                    }
                });
            });
        }

        $scope.gotoDetail = function (id, type) {
            if (type == "collect") {
                $state.go("home.newCollectDetail", {collectId: id});
            } else {
                $state.go("home.operationDetail", {activityId: id});
            }
        }

        $scope.bannerPlay = function () {
            //滑动画
            $(".swiper-container").swiper({
                loop: false,
                observer: true,
                updateOnImagesReady: true,
                lazyLoading: true,
                autoplay: 5000
            });
        }

        /* 广告轮播 end */

        /* 火热报名 begin */

        var pageIndex = 0;
        var pageSize = 1000;
        $scope.collectList = [];//征集列表
        $scope.taskList = []; //任务列表

        //获取参议政列表
        getCollects();
        function getCollects() {
            CollectListResource.queryCollectList(null, 3, 1, 0, pageIndex, pageSize).success(function (resp) {
                if (resp != undefined && resp.length > 0) {
                    $scope.collectList = resp;
                }
            });
        }

        // 获取新的任务列表
        getNewTasks();
        function getNewTasks() {
            TaskResource.getNewTaskList($scope.taskName, 0, 0, 0, pageIndex, pageSize).success(function (resp) {
                if (resp != undefined && resp.length > 0) {
                    $scope.taskList = resp;
                }
            });
        }

        //查看征集明细
        $scope.goCollectDetailPage = function (collectId) {
            $state.go("home.newCollectDetail", {collectId: collectId});
        };

        //新任务详情页面
        $scope.goNewTaskDetail = function (taskId) {
            $state.go("home.newTaskDetail", {taskId: taskId});
        };

        /* 火热报名 end */

        /* 近期动态 begin */

        var pageDynamicNo = 1;
        var pageDynamicSize = 10;
        $scope.dynamicList = []; //动态列表
        var scrollFlag = true;

        $scope.scrollHandler = queryDynamicList;

        //方法——获得新的任务动态列表
        queryDynamicList();
        function queryDynamicList() {
            if (scrollFlag) {
                TaskResource.getSocialTaskDynamicList(pageDynamicNo, pageDynamicSize).success(function (resp) {
                    if (resp != undefined && resp.length > 0) {
                        $scope.dynamicList = $scope.dynamicList.concat(resp);
                        if (resp.length < pageDynamicSize) {
                            scrollFlag = false;
                        }
                        pageDynamicNo++;
                    } else {
                        scrollFlag = false;
                    }
                });
            }
        }

        //近期动态详情页面
        $scope.goDynamicTaskDetail = function (taskId) {
            $state.go("home.dynamicTaskDetail", {taskId: taskId});
        };
        /* 近期动态 end */
    }

    controller.$inject = deps;
    app.lazy.controller("TaskController", controller);
});
