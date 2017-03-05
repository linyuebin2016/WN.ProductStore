define(["app",
    "services/BaseService",
    "services/SessionStorageService",
    "resources/CollectListResource"
], function (app, $, node, _) {

    "use strict";

    var deps = ["$scope", "$state", "BaseService", 'SessionStorageService', 'CollectListResource'];
    var config;

    function controller($scope, $state, BaseService, SessionStorageService, CollectListResource) {
        $scope.codeLogin().then(function () {
            $scope.baseUrl = BaseService.restfulUrl;
            $scope.runInBrowser = runInBrowser();

            $scope.currentUser = SessionStorageService.getItem("user");

            $scope.typeShow = false;
            $scope.typeClick = function () {
                $scope.typeShow = !$scope.typeShow;
            }
            //置顶征集
            $scope.topCollect = null;
            $scope.topPic = null;

            //方法——获得置顶征集
            function queryTop() {
                CollectListResource.queryTopCollect().success(function (resp) {
                    console.log(resp);
                    if (resp && resp.collectionPic) {
                        $scope.topCollect = resp;
                        $scope.topPic = $scope.baseUrl + 'fileUploadController/showPic/' + $scope.topCollect.collectionPic + '?picType=2';
                    }
                });
            }

            queryTop();
            $state.go("home.task.MCollectList");

            $scope.queryItemById = function (item) {
                $state.go("home.collectDetail", {
                    collectId: item.collectionId
                });
            }

            $state.go("home.task.MCollectList");

            /**
             * 我负责的任务列表
             */
            $scope.goMResponsibleTaskList = function () {
                $state.go("home.task.mResponsibleTaskList");
            };

            /**我报名的任务列表 */
            $scope.goMyParticipatedTaskList = function () {
                $state.go("home.task.myParticipatedTaskList");
            }
        })

    }

    controller.$inject = deps;
    app.lazy.controller("TaskController", controller);
});