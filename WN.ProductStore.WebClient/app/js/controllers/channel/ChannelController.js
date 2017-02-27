define(["app",
    "jquery",
    "services/MessageBox",
    "directives/Loading",
    'directives/AdaptiveHeight',
    'resources/ChannelResource',
    'directives/InfiniteScroll'
], function (app, $, node, _) {

    "use strict";

    var deps = ["$scope", "$state", "$stateParams", "BaseService", 'MessageBox', 'ChannelResource'];

    function controller($scope, $state, $stateParams, BaseService, MessageBox, ChannelResource) {

        $scope.groupId = $stateParams.channelId;
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.manage = $stateParams.manage;
        $scope.channelState = 0;
        $scope.groupName = "";
        $scope.groupPic;
        $scope.attentionState = 0;
        $scope.channelInfo = {};
        $scope.setActive = $scope.groupId;

        $scope.manage = $stateParams.manage;

        if ($stateParams.channelName) {
            $scope.groupName = $stateParams.channelName;
        }
        if ($stateParams.pageName && $stateParams.pageName == 'attention') {
            $scope.setActive = $scope.groupId + "a";
            $scope.attentionState = 1;
        }
        //$scope.$parent.setActive($scope.setActive);
        $scope.groupItem = {
            count: 0,
            channelItems: []
        };

        $scope.scrollFlag = true;

        $scope.groupModel = {
            channelItemName: null,
            pageIndex: 1,
            pageSize: 15
        }

        $scope.scrollHandler = getChannelItemList;

        //获取咨询号发布的咨询列表
        function getChannelItemList() {
            if ($scope.scrollFlag) {
                ChannelResource.queryChannelItemDetail($scope.groupId, $scope.groupModel.channelItemName, $scope.groupModel.pageIndex, $scope.groupModel.pageSize).success(function (resp) {
                    $scope.groupId = resp.channelVo.groupId;
                    $scope.channelState = resp.channelVo.status;
                    $scope.groupName = resp.channelVo.groupName;
                    $scope.groupPic = resp.channelVo.picId;
                    if (resp && resp.channelItems && resp.channelItems.length > 0) {
                        $scope.groupItem.count = resp.count;
                        $scope.groupItem.channelItems = $scope.groupItem.channelItems.concat(resp.channelItems);
                        if (resp.channelItems.length < $scope.groupModel.pageSize) {
                            $scope.scrollFlag = false;
                        }
                        $scope.groupModel.pageIndex++;
                    } else {
                        $scope.scrollFlag = false;
                    }
                });
            }
        }

        getChannelItemList();

        //获取咨询号发布的咨询列表
        $scope.getChannel = function () {
            ChannelResource.getChannel($scope.groupId).success(function (resp) {
                $scope.channelInfo = resp;
            });
        }

        //根据咨询名称，获得咨询列表
        $scope.getByName = function () {
            dataClear();
            getChannelItemList();
        };

        //清除数据
        function dataClear() {
            $scope.scrollFlag = true;
            $scope.groupItem.count = 0;
            $scope.groupItem.channelItems = [];
            $scope.groupModel.pageIndex = 1;
            $scope.groupModel.pageSize = 15;
        }

        //跳转到咨询明细页面
        $scope.channelItemView = function (item) {
            $state.go('home.channel.channelItemView', {
                groupId: $scope.groupId,
                itemId: item.topicItiemId,
                manage: $scope.manage
            });
        };

        /**点赞 */
        $scope.itemAssist = function collectAssist(item) {
            ChannelResource.assistItem(item.topicItiemId).success(function (response) {
                item.praiseFlag = getNumType(item.praiseFlag);
                if (response == "1") {
                    item.praiseCount--;
                } else {
                    item.praiseCount++;
                }
            });
        }

        //发布新资讯
        $scope.newChannelItem = function addChannelItem() {
            $state.go('home.channel.channelItem', {
                groupId: $scope.groupId
            });
        };

        //修改资讯
        $scope.updChannelItem = function editChannelItem(groupId, itemId) {
            $state.go('home.channel.channelItem', {
                groupId: $scope.groupId,
                itemId: itemId
            });
        };

        //删除资讯
        $scope.delChannelItem = function deleteChannelItem(itemId) {
            var d = MessageBox.confirmResult("确定删除？");
            d.result.then(function (result) {
                if (result === "yes") {
                    ChannelResource.removeChannelItem(itemId).success(function () {
                        $("#" + itemId).remove();
                    });
                }
            });
        };

        //取消关注
        $scope.noAttention = function () {
            var d = MessageBox.confirmResult("确定取消关注？");
            d.result.then(function (result) {
                if (result === "yes") {
                    ChannelResource.unSubscribeChannel($scope.groupId).success(function () {
                        $scope.attentionState = 0;
                        $scope.$parent.getAttentionChannelList();
                    });
                }
            });
        }

        //关注
        $scope.addAttention = function () {

            var d = MessageBox.confirmResult("确定关注？");
            d.result.then(function (result) {
                if (result === "yes") {
                    ChannelResource.subscribeChannel($scope.groupId).success(function () {
                        $scope.attentionState = 1;
                        $scope.$parent.getAttentionChannelList();
                    });
                }
            });

        }

        function getNumType(type) {
            var value;
            if (type == 0) {
                value = 1;
            } else {
                value = 0;
            }
            return value;
        }

    }

    controller.$inject = deps;
    app.lazy.controller("ChannelController", controller);
});