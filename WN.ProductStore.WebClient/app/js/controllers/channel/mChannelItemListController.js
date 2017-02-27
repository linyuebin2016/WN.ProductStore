/**
 * Created by zhuyunfeng on 2016/11/26.
 */
define(["app",
    "services/BaseService",
    'resources/ChannelResource',
    'directives/InfiniteScroll'
], function (app, $, node, _) {

    "use strict";

    var deps = ["$scope", "$cookieStore", "$state", "$stateParams", "BaseService", 'ChannelResource', 'UserService'];

    function controller($scope, $cookieStore, $state, $stateParams, BaseService, ChannelResource, UserService) {

        $scope.scrollFlag = true;
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.channelVo = {};
        var currentUser = UserService.getCurrentUser();
        $scope.loading = true;
        $scope.groupItem = {
            count: 0,
            itemList: []
        };

        $scope.groupId = '';
        if ($stateParams.groupId) {
            $scope.groupId = $stateParams.groupId;
            $cookieStore.put("appgroupId", $scope.groupId);
        } else {
            $scope.groupId = $cookieStore.get("appgroupId");
        }

        $scope.groupModel = {
            channelItemName: null,
            pageIndex: 0,
            pageSize: 4
        }
        getItemList();
        $scope.scrollHandler = getItemList;

        //获取该资讯号下发布的资讯列表
        function getItemList() {
            if ($scope.scrollFlag) {
                ChannelResource.queryChannelItemDetail($scope.groupId, $scope.groupModel.channelItemName, $scope.groupModel.pageIndex, $scope.groupModel.pageSize).success(function (resp) {
                    $scope.channelVo = resp.channelVo;
                    if (resp && resp.channelItems && resp.channelItems.length > 0) {
                        $scope.groupId = resp.channelVo.groupId;

                        $scope.groupItem.count = resp.count;
                        $scope.groupItem.itemList = $scope.groupItem.itemList.concat(resp.channelItems);
                        if (resp.channelItems.length < $scope.groupModel.pageSize) {
                            $scope.scrollFlag = false;
                        }
                        $scope.groupModel.pageIndex++;
                        $scope.loading = false;
                    } else {
                        $scope.scrollFlag = false;
                    }
                });
            }
        }


        //跳转到资讯明细页面
        $scope.goItemDetail = function (item) {
            $state.go("home.channelItemDetail", {
                groupId: $scope.groupId,
                itemId: item.topicItiemId
            });
        }

        /**资讯号明细 */
        $scope.goChannelDetail = function () {
            $state.go("home.channelDetail", {
                groupId: $scope.groupId
            });
        }

        /**点赞 */
        $scope.itemAssist = function collectAssist(item) {
            ChannelResource.assistItem(item.topicItiemId).success(function (response) {
                item.praiseFlag = 1 - item.praiseFlag;
                if (response == "1") {
                    item.praiseCount--;
                    for (var i = 0; i < item.latetestPraiseUser.length; i++) {
                        if (currentUser.userId == item.latetestPraiseUser[i].userId) {
                            item.latetestPraiseUser.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    item.praiseCount++;
                    var newuser = {
                        userId: currentUser.userId,
                        userName: currentUser.userName,
                        sex: currentUser.sex
                    }
                    item.latetestPraiseUser.push(newuser);
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

        $scope.goPariseDetail = function (item) {
            $state.go("home.channelPraiseDetail", {
                item: item
            });
        }

    }

    controller.$inject = deps;
    app.lazy.controller("mChannelItemListController", controller);
});