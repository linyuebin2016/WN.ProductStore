/**
 * Created by zhuyunfeng on 2016/11/25.
 */

define(["app",
    "jquery",
    "services/TipsService",
    "services/MessageBox",
    "directives/Loading",
    'directives/AdaptiveHeight',
    'resources/ChannelResource'
], function (app, $, node, _) {

    "use strict";

    var deps = ["$scope", "$state", "TipsService", 'MessageBox', 'ChannelResource'];

    function controller($scope, $state, TipsService, MessageBox, ChannelResource) {
        $scope.manageList = []; //我管理列表
        $scope.attentionList = []; //我关注列表

        $state.go("home.channel.channelRecommend");
        $scope.up0 = true;
        $scope.up1 = true;
        $scope.ngstyle0 = {
            'display': 'block'
        }
        $scope.ngstyle1 = {
            'display': 'block'
        }
        $scope.upOrDown = function (id) {
                if (id == 0) {
                    $scope.up0 = !$scope.up0;
                    if (!$scope.up0) {
                        $scope.ngstyle0 = {
                            'display': 'none'
                        }
                    } else {
                        $scope.ngstyle0 = {
                            'display': 'block'
                        }
                    }
                } else {
                    $scope.up1 = !$scope.up1;
                    if (!$scope.up1) {
                        $scope.ngstyle1 = {
                            'display': 'none'
                        }
                    } else {
                        $scope.ngstyle1 = {
                            'display': 'block'
                        }
                    }
                }
            }
            //获取我管理的咨询号列表
        $scope.getManageChannelList = function () {
            ChannelResource.getManageChannels().success(function (resp) {
                if (resp && resp.length > 0) {
                    $scope.manageList = resp;
                } else {
                    $scope.manageList = [];
                }
            });
        }
        $scope.getManageChannelList();

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

        $scope.setActive = function (groupId) {
            $("#manageList > li").removeClass("active");
            $("#attentionList > li").removeClass("active");
            $('#' + groupId).addClass("active");
        }
    }
    controller.$inject = deps;
    app.lazy.controller("ChannelMainController", controller);
});