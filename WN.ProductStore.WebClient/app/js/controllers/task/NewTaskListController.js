/**
 * Created by zhuyunfeng on 2016/12/8.
 */
define(["app", "jquery", "swiper",
    "services/BaseService",
    "filters/Moment",
    "resources/TaskResource",
    "resources/CollectListResource",
    'directives/InfiniteScroll',
    'directives/RepeatFinish',
    "resources/OperationalActivityResource"
], function (app) {
    var deps = ["$scope", "BaseService", "CollectListResource", "TaskResource", "$state", "OperationalActivityResource"];

    function controller($scope, BaseService, CollectListResource, TaskResource, $state, OperationalActivityResource) {
        $scope.codeLogin().then(function () {
            var pageIndex = 0;
            var pageSize = 1000;
            var pageDynamicNo = 1;
            var pageDynamicSize = 10;
            var imgUrl = "";
            $scope.advertisementList = [];//置顶轮播图片
            $scope.topCollect = [];//置顶征集图片
            $scope.scrollFlag = true;
            $scope.collectList = [];//征集列表
            $scope.taskList = []; //任务列表
            $scope.dynamicList = []; //动态列表

            //$scope.drawList = []; //抽奖列表

            $scope.baseUrl = BaseService.restfulUrl;
            //$scope.scrollHandler = queryList;

            //方法——初始化数据
            init();
            function init() {
                //方法——获得广告列表  1.轮播 2.置顶 包括征集置顶
                queryAdvertisement(1);
                //获取参议政列表
                getCollects();
                // 获取新的任务列表
                getNewTasks();
                //方法——获得新的任务动态列表
                queryDynamicList();

                //getNewDraws();
            }

            //获得广告列表  1.轮播 2.置顶 包括征集置顶
            function queryAdvertisement(showType) {
                //获得置顶征集
                CollectListResource.queryTopCollect().success(function (resp) {
                    if (resp && resp.collectionPic) {
                        imgUrl = BaseService.restfulUrl + "fileUploadController/showPic/" + resp.collectionPic + "?&picType=1";
                        $scope.topCollect = {
                            imgUrl: imgUrl,
                            activityId: resp.collectionId,
                            activityName: resp.collectionName,
                            status: 0,
                            type: 'collect'
                        };
                        $scope.advertisementList[0] = $scope.topCollect;
                    }
                    OperationalActivityResource.getAdvertisementList(showType).success(function (resp) {
                        if (resp != undefined && resp.length > 0) {
                            //$scope.advertisementList =  resp;
                            for (var i = 0; i < resp.length; i++) {
                                if (resp[i].status == 0) {
                                    imgUrl = BaseService.restfulUrl + "fileUploadController/showPic/" + resp[i].picId + "?&picType=1";
                                    resp[i].imgUrl = imgUrl;
                                    $scope.advertisementList.push(resp[i]);
                                }
                            }
                        }
                    });
                });
            }


            //获取参议政列表
            function getCollects() {
                CollectListResource.queryCollectList(null, 3, 1, 0, pageIndex, pageSize).success(function (resp) {
                    if (resp != undefined && resp.length > 0) {
                        $scope.collectList = resp;
                    }
                });
            }

            // 获取新的任务列表
            function getNewTasks() {
                TaskResource.getNewTaskList($scope.taskName, 0, 0, 0, pageIndex, pageSize).success(function (resp) {
                    if (resp != undefined && resp.length > 0) {
                        $scope.taskList = resp;
                    }
                });
            }

            // // 获取新的抽奖列表
            // function getNewDraws() {
            //     $scope.drawList=[{id:'111',name:"抽奖的测试呀"}];
            // }
            // //查看抽奖明细
            // $scope.goDrawDetail = function (id) {
            //     $state.go("home.drawDetail", {drawId: id});
            // };

            $scope.scrollHandler = queryDynamicList;

            //方法——获得新的任务动态列表
            function queryDynamicList() {
                if ($scope.scrollFlag) {
                    TaskResource.getSocialTaskDynamicList(pageDynamicNo, pageDynamicSize).success(function (resp) {
                        if (resp != undefined && resp.length > 0) {
                            $scope.dynamicList = $scope.dynamicList.concat(resp);
                            if (resp.length < pageDynamicSize) {
                                $scope.scrollFlag = false;
                            }
                            pageDynamicNo++;
                        } else {
                            $scope.scrollFlag = false;
                        }
                    });
                }
            }

            //查看征集明细
            $scope.goCollectDetailPage = function (collectId) {
                $state.go("home.newCollectDetail", {collectId: collectId});
            };

            //新任务详情页面
            $scope.goNewTaskDetail = function (taskId) {
                $state.go("home.newTaskDetail", {taskId: taskId});
            };

            //近期动态详情页面
            $scope.goDynamicTaskDetail = function (taskId) {
                $state.go("home.dynamicTaskDetail", {taskId: taskId});
            };

            $scope.goDetailPage = function (Id, type) {
                if (type != undefined) {
                    $state.go("home.newCollectDetail", {collectId: Id});
                } else {
                    $state.go("home.operationDetail", {activityId: Id});
                }
            };

            $scope.goEndRegistration = function () {
                $state.go("home.endRegistration");
            };

            $scope.goMyTaskList = function () {
                $state.go("home.myTaskList");
            };

            $scope.bannerPlay = function () {
                //滑动画
                //var mySwiper = new Swiper('.swiper-container',{
                //    onImagesReady: function(swiper){
                //        alert('事件触发了;');
                //    },
                //})
                $(".swiper-container").swiper({
                    loop: false,
                    observer: true,
                    updateOnImagesReady: true,
                    lazyLoading: true,
                    autoplay: 5000
                });
            }

        })
    }

    controller.$inject = deps;
    app.lazy.controller("NewTaskListController", controller);
});