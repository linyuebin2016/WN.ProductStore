/**
 * Created by shengxiangyang on 2016-12-26.
 */
define(["app",
    "resources/SuggestionResource"
], function (app) {

    var deps = ["$scope", "$state", "SuggestionResource"];

    function controller($scope, $state, SuggestionResource) {

        $scope.keyWord = null;

        $scope.orgVo = [];

        //查询我发送的组织列表
        $scope.searchOrg = function () {
            var keyword = $scope.keyWord;
            if (keyword) {
                SuggestionResource.searchOrgByOrgName(keyword).success(function (resp) {
                    if (resp && resp.length > 0) {
                        $scope.orgVo = resp;
                    }
                });
            }
        };

        //选中组织事件
        $scope.confirm_item = function (org) {
            $state.go("home.suggestionWrite", {
                orgId: org.pcId,
                orgName: org.pcName
            });
        };

        //清空输入框的内容
        $scope.search_clear = function () {
            $scope.keyWord = null;
        }
    }

    controller.$inject = deps;
    app.lazy.controller("SuggestionSearchOrgController", controller);
});
