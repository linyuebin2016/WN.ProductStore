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
        // $scope.codeLogin().then(function () {
            $scope.baseUrl = BaseService.restfulUrl;
            $scope.runInBrowser = runInBrowser();
            $scope.currentUser = SessionStorageService.getItem("user");

            $scope.goMyAttention = function () {
                $state.go('home.channelAttention');
            }

            $scope.attentionList = {};

            $scope.models = {};
            /**参数 */
            $scope.param = {
                pageNo: 1,
                pageIndex: 1,
                pageSize: 10,
                keyword: undefined,
                orderProp: undefined, //排序字段
                orderType: 0 //排序  （0降 1升）
            };
            $scope.sort = {
                articleCount: 0,
                readCount: 0,
                attentionCount: 0,
                praiseCount: 0
            }
            $scope.scrollHandler = _scrollHandler;

            function _scrollHandler() {
                $scope.param.pageNo++;

            }

            getManageChannelList();

            //获取我管理的咨询号列表
            function getManageChannelList() {
                ChannelResource.getManageChannels().success(function (resp) {

                    if (resp && resp.length > 0) {
                        $scope.manageList = resp;
                    } else {
                        $scope.manageList = [];
                    }
                });
            }


            $scope.goChannelItemList = function (channel) {
                $state.go("home.channelItemList", {
                    groupId: channel.groupId
                });
            }


            //获取我关注的咨询号列表
            $scope.getAttentionChannelList = function () {
                ChannelResource.queryMySubscribeChannels().success(function (resp) {
                    if (resp && resp.length > 0) {
                        $scope.attentionList = resp;
                    } else {
                        $scope.attentionList = [];
                    }
                });
            }
            $scope.getAttentionChannelList();

            //跳转到资讯号发布的信息列表
            $scope.goGroupItemList = function (group) {
                $state.go('home.channelItemList', {
                    groupId: group.groupId
                });
            }

            //资讯号推荐
            $scope.goChannelRecommend = function () {
                $state.go('home.channelRecommend');
            }

            //查看更新关注的资讯号
            $scope.goChannelAttentionMore=function(){
                $state.go('home.channelAttentionMore');
            }

            /**我关注的资讯号列表 */
            $scope.channelAttention = function () {
                $state.go("home.channelAttention");
            }
            $scope.isRecommend = false;
            /**参数 */
            $scope.paramChannelRecommends = {
                pageNo: 1,
                pageSize: 10,
                keyword: undefined,
                orderProp: undefined, //排序字段
                orderType: 0 //排序  （0降 1升）
            };


            queryRecommendChannels();

            /**推荐咨询号列表 */
            function queryRecommendChannels() {
                ChannelResource.queryRecommendChannels($scope.paramChannelRecommends).success(function (response) {
                    $scope.channelRecommends = response;
                    if (response.length == 0) {
                        $scope.isRecommend = true;
                    }
                });
            }

        // })
    }

    controller.$inject = deps;
    app.lazy.controller("ChannelHomeController", controller);
});