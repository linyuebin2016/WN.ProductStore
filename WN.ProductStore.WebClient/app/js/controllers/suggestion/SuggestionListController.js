/**
 * Created by shengxiangyang on 2016-12-22.
 */
define(["app", "jquery",
    "resources/SuggestionResource"
], function (app, $) {

    var deps = ["$scope", "$state", "$stateParams", "SuggestionResource", "$cookieStore"];

    function controller($scope, $state, $stateParams, SuggestionResource, $cookieStore) {

        $("#zhuanxie_btm").show();
        $scope.suggestionList = [];

        $scope.pageNo = 1;
        $scope.pageSize = 10;

        $scope.contextType = $stateParams.contextType;
        $scope.listType = $stateParams.listType;
        if ($scope.contextType) {
            $cookieStore.put('suggestionList', $scope.contextType);
            $cookieStore.put('suggestionList', $scope.listType);
        } else {
            $scope.contextType = $cookieStore.get('suggestionList');
            $scope.listType = $cookieStore.get('suggestionList');
        }
        $scope.contextType = parseInt($scope.contextType);
        $scope.listType = parseInt($scope.listType);
        if ($scope.listType == 0) {
            if ($scope.$parent.setEssenceActive) {
                $scope.$parent.setEssenceActive("contexttype" + $scope.contextType);
            } else {
                $("#contexttype4,#contexttype5,#contexttype6").removeClass("weui_bar_item_on");
                $('#contexttype' + $scope.contextType).addClass("weui_bar_item_on");
            }
        }

        /**
         * 查询我的声音列表
         */
        function queryList() {
            SuggestionResource.getMySuggestionList($scope.pageNo, $scope.pageSize).success(function (resp) {
                if (resp != undefined && resp.length > 0) {
                    $scope.suggestionList = resp;
                } else {
                    $scope.suggestionList = [];
                }
            });
        }

        /**
         * 获取我的声音明细
         * @param topicId
         */
        $scope.queryItemById = function (topicId) {
            $state.go("home.suggestionDetail", {topicId: topicId});
        };

        //查询列表
        queryList();
    }

    controller.$inject = deps;
    app.lazy.controller("SuggestionListController", controller);
});
