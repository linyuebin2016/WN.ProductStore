/**
 * Created by zhuyunfeng on 2017/2/22.
 */
define(["app", "jquery", "jqueryWeUI",
    'directives/InfiniteScroll',
    "resources/CollectListResource"
], function (app, $, _) {
    var deps = ["$scope", "$state", "CollectListResource"];

    function controller($scope, $state, CollectListResource) {
        $scope.codeLogin().then(function () {

            //我负责的
            $scope.wfzdczyzList = [];
            //我报名的
            $scope.wbmdczyzList = [];
            //已结束的
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
                $scope.wfzdczyzList = [];
                queryWfzdczyzList();
            }

            //我报名的
            function queryWbmdList() {
                $scope.wbmdczyzList = [];
                queryWbmdczyzList();
            }

            //已结束的
            function queryYjsList() {
                $scope.yjsczyzList = [];
                queryYjsWfzdczyzList();
                queryYjsWbmdczyzList();
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

            /**
             * 跳转到详情页面
             * @param type
             * @param taskId
             */
            $scope.queryItemById = function (type, taskId,task) {
                if (type == 0) {
                    $state.go("home.myResponsibleCollectDetail", {collectionId: taskId});
                } else if (type == 2) {
                    $state.go("home.mEnrollCollectDetail", {collectionId: taskId});
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

        });
    }

    controller.$inject = deps;
    return app.lazy.controller("MMyTaskListController", controller);
});