/**
 * Created by zhuyunfeng on 2016/11/26.
 */
define(["app",
    'resources/ChannelResource'
], function (app, $, node, _) {

    var deps = ["$scope", "$state", 'ChannelResource'];

    function controller($scope, $state, ChannelResource) {
        $scope.attentionList = []; //我关注列表

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
        $scope.goChannelItemList = function (channel) {
            $state.go("home.channelItemList", {
                groupId: channel.groupId
            });
        }
    }

    controller.$inject = deps;
    app.lazy.controller("mChannelAttentionController", controller);
});