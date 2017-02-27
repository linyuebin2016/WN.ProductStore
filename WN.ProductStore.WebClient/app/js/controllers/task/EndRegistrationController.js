/**
 * Created by zhuyunfeng on 2016/12/7.
 */
define(["app",
    "services/UserService",
    "resources/TaskResource",
    'directives/InfiniteScroll',
    "resources/CollectListResource"
], function (app) {
    var deps = ["$scope", "TaskResource", "$state", "CollectListResource"];

    function controller($scope, TaskResource, $state, CollectListResource) {
        //$scope.currentuser = UserService.getCurrentUser();
        $scope.pageIndex = 0;
        $scope.pageSize = 10;
        //是否允许滚动触发事件
        $scope.scrollFlag = true;
        //任务列表
        $scope.models = [];
        $scope.collects = [];
        //所在Tab(0:进行中  1:已完成)
        $scope.taskState = 1;
        //广告列表
        $scope.advertisementList = [];

        $scope.scrollHandler = queryList;

        queryList();
        getCollectionEndStateList();

        //Tab切换事件
        $scope.tabClick = function (tabId) {
            if ($scope.taskState != tabId) {
                $scope.taskState = tabId;
                // if(tabId==0) {
                //     $scope.querySort=$scope.querySort0;
                // }else {
                //     $scope.querySort=$scope.querySort1;
                // }
                if (sortClearData()) {
                    queryList();
                }
            }
        };

        function sortClearData() {
            $scope.pageIndex = 0;
            $scope.scrollFlag = true;
            $scope.models = [];
            return true;
        }

        $scope.queryListMore = function () {
            queryList();
        }

        function queryList() {
            if ($scope.scrollFlag) {
                //  参数:taskName, taskState, orders, asc, pageNo, pageSize                        
                TaskResource.getNewTaskList(undefined, $scope.taskState, 0, 0, $scope.pageIndex, $scope.pageSize).success(function (resp) {
                    if (resp != undefined && resp.length > 0) {
                        $scope.models = $scope.models.concat(resp);
                        if (resp.length < $scope.pageSize) {
                            $scope.scrollFlag = false;
                        }
                        $scope.pageIndex++;
                    } else {
                        $scope.scrollFlag = false;
                    }
                });
            }
        }

        //跳转到明细页面
        $scope.goDetail = function (data) {
            $state.go("home.endTaskDetail", {
                taskId: data.taskId
            });
        }

        /**获取当前用户没有参与的 已经结束的征集列表：主要用于移动端主页  */
        function getCollectionEndStateList() {
            CollectListResource.getCollectionEndStateList().success(function (response) {
                $scope.collects = response;
            });
        }
    }

    controller.$inject = deps;
    return app.lazy.controller("EndRegistrationController", controller);
});