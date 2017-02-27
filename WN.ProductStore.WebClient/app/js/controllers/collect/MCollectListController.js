/**
 * Created by zhuyunfeng on 2016/11/18.
 */
define(["app",
    "resources/CollectListResource",
    'directives/InfiniteScroll'
], function (app) {
    var deps = ["$scope", "CollectListResource", "$state"
    ];

    function controller($scope, CollectListResource, $state) {
        var pageIndex = 1;
        var pageSize = 10;
        $scope.scrollFlag = true;
        $scope.collectList = [];

        $scope.querySort = {
            sortFilter: 1,//0：创建日期 1：报名截止日期
            sortDesc: 0//0倒序排列
        }

        $scope.scrollHandler = queryList;
        //方法——获得征集列表
        function queryList() {
            if ($scope.scrollFlag) {
                CollectListResource.queryCollectList(null, 3, $scope.querySort.sortFilter, $scope.querySort.sortDesc, pageIndex, pageSize).success(function (resp) {
                    if (resp.length > 0) {
                        $scope.collectList = $scope.collectList.concat(resp);
                        if (resp.length < pageSize) {
                            $scope.scrollFlag = false;
                        }
                        pageIndex++;
                    } else {
                        $scope.scrollFlag = false;
                    }
                });
            }
        }

        queryList();

        $scope.goDetailPage = function (item) {
            $state.go("home.collectDetail", {collectId: item.collectionId});
        }
    }

    controller.$inject = deps;
    return app.lazy.controller("MCollectListController", controller);
});
