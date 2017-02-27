/**
 * Created by zhuyunfeng on 2016/11/26.
 */
define(["app",
    "directives/CommentForWx",
    "directives/AReward",
    'resources/ChannelResource',
    "services/DownloadFileService",
    "services/BaseService",
    "filters/cut",
    'filters/byte',
    'directives/UserImageForWx'
], function (app) {

    "use strict";

    var deps = ["$scope", "$cookieStore", "$state", "$stateParams", "BaseService", 'ChannelResource', 'DownloadFileService'];

    function controller($scope, $cookieStore, $state, $stateParams, BaseService, ChannelResource, DownloadFileService) {
        $scope.itemId = '';
        if ($stateParams.itemId) {
            $scope.itemId = $stateParams.itemId;
            $cookieStore.put("appItemId", $scope.itemId);
        } else {
            $scope.itemId = $cookieStore.get("appItemId");
        }

        $scope.item = {}; //资讯明细

        //获取资讯明细信息
        $scope.getItemDeatil = function () {
            ChannelResource.getChannelItem($scope.itemId).success(function (resp) {
                $scope.item = resp;
            });
        }
        $scope.getItemDeatil();

        /**点赞 */
        $scope.itemAssist = function collectAssist() {
            ChannelResource.assistItem($scope.item.topicItiemId).success(function (response) {
                $scope.item.praiseFlag = !$scope.item.praiseFlag;
                if (response == "1") {
                    $scope.item.praiseCount--;
                } else {
                    $scope.item.praiseCount++;
                }
            });
        }

        //下载附件
        $scope.downLoadAttach = function (attach) {
            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attach.attachId;
            DownloadFileService.downloadFiletoDisk(url, attach.attachName);
        }

        //附件预览
        $scope.attachView = function (attachItem) {
            //跳转到预览页面
            $state.go("home.attachView", {
                attachURL: attachItem.attachId,
                type: attachItem.attachType
            });
        }
    }
    controller.$inject = deps;
    app.lazy.controller("mChannelItemDetailController", controller);
});