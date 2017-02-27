define(["app",
    "services/BaseService",
    'services/TipsService',
    "services/SessionStorageService",
    "resources/ChannelResource"
], function (app) {

    "use strict";

    var deps = ["$scope", "$state", "BaseService", "TipsService", 'SessionStorageService', "ChannelResource"];
    var config;

    function controller($scope, $state, BaseService, TipsService, SessionStorageService, ChannelResource) {
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.runInBrowser = runInBrowser();
        $scope.currentUser = SessionStorageService.getItem("user");

        $scope.attentionList = {};

        $scope.scrollHandler = _scrollHandler;

        function _scrollHandler() {
            $scope.param.pageNo++;

        }

        getAttentionChannelList();

        //获取我关注的咨询号列表
        function getAttentionChannelList() {
            ChannelResource.queryMySubscribeChannels().success(function (resp) {
                if (resp && resp.length > 0) {
                    $scope.attentionList = resp;
                } else {
                    $scope.attentionList = [];
                }
            });
        }

        $scope.goChannelItemList = function (channel) {
            $state.go("home.channelItemList", {
                groupId: channel.groupId
            });
        }
    }

    controller.$inject = deps;
    app.lazy.controller("ChannelAttentionMoreController", controller);
});