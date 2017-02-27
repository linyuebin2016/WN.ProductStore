define(["app",
    "services/UserService",
    "directives/Loading",
    'directives/AdaptiveHeight',
    'resources/ChannelResource',
    "resources/ChannelRecommendResource",
    'directives/InfiniteScroll'
], function (app, $, node, _) {

    "use strict";

    var deps = ["$scope", "$state", "$stateParams", "BaseService", "UserService",  'ChannelResource', "ChannelRecommendResource"];

    function controller($scope, $state, $stateParams, BaseService, UserService,  ChannelResource, ChannelRecommendResource) {
        // $scope.codeLogin().then(function () {

            var currentUser = UserService.getCurrentUser();
            $scope.baseUrl = BaseService.restfulUrl;
            $scope.groupId = $stateParams.groupId;
            $scope.channel = {};
            $scope.isMyChannel = true;
            getChannel();
            // channelManageUserId
            //获取咨询号发布的咨询列表
            function getChannel() {
                ChannelResource.getChannel($scope.groupId).success(function (resp) {
                    $scope.channel = resp;

                    if (currentUser != undefined && currentUser.userId == resp.channelManageUserId) {
                        $scope.isMyChannel = true;
                    } else {
                        $scope.isMyChannel = false;
                    }
                });
            }

            // /**关注 */
            // $scope.subscribeChannel = function (wfzdczyz) {
            //     $.confirm("确定关注", "确定关注", function () {
            //         ChannelRecommendResource.subscribeChannel($scope.groupId).success(function (response) {
            //             $.toast("已关注!");
            //             getChannel();
            //         });
            //     }, function () {
            //         return false;
            //     });
            // };

            // /**关注 */
            $scope.subscribeChannel = function subscribeChannel() {
                // var result = confirm("确定关注？");
                // if (result) {
                //     ChannelRecommendResource.subscribeChannel($scope.groupId).success(function (response) {
                //         getChannel();
                //     });
                // }

                ChannelRecommendResource.subscribeChannel($scope.groupId).success(function (response) {
                    getChannel();
                });
            }

            //取消关注
            // $scope.cancelSubscribeChannel = function (wfzdczyz) {
            //     $.confirm("确定取消关注", "取消关注", function () {
            //         ChannelResource.unSubscribeChannel($scope.groupId).success(function (response) {
            //             $.toast("已取消!");
            //             getChannel();
            //         });
            //     }, function () {
            //         return false;
            //     });
            // };

            $scope.cancelSubscribeChannel = function cancelSubscribeChannel() {
                // var result = confirm("确定取消关注？");
                // if (result) {
                //     ChannelResource.unSubscribeChannel($scope.groupId).success(function (response) {
                //         getChannel();
                //     });
                // }
                ChannelResource.unSubscribeChannel($scope.groupId).success(function (response) {
                    getChannel();
                })
            }

            $scope.goChannelItemList = function () {
                $state.go("home.channelItemList", {
                    groupId: $scope.groupId
                });
            }



        // })
    }

    controller.$inject = deps;
    app.lazy.controller("ChannelDetailController", controller);
});