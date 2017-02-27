/**
 * Created by shengxiangyang on 2016-12-29.
 */
define(["app", "jquery",
    "resources/SuggestionResource"
], function (app, $) {

    var deps = ["$scope","$state", "$stateParams", "SuggestionResource"];

    function controller($scope, $state, $stateParams, SuggestionResource) {
        $scope.codeLogin().then(function(){
            $scope.basicSgtList = [];
            /**
             * 查询基层声音列表
             */
            function queryList() {
                SuggestionResource.getBasicSuggestionList(1,10).success(function (resp) {
                    if (resp != undefined && resp.length > 0) {
                        $scope.basicSgtList = resp;
                    } else {
                        $("#null_sgtList").show();
                        $scope.basicSgtList = [];
                    }
                });
            }

            /**
             * 获取基层声音明细
             * @param topicId
             */
            $scope.queryItemById = function (topicId) {
                $state.go("home.basicSgtDetail", {topicId:topicId});
            };

            //查询列表
            queryList();
        });
    }

    controller.$inject = deps;
    return app.lazy.controller('SuggestionBasicListController', controller);
});
