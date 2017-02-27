/**
 * Created by shengxiangyang on 2016-12-14.
 */
define([
    'app',
    "jquery",
    "jqueryWeUI",
    'resources/CollectListResource',
    'services/TipsService',
    "directives/CommentForWx",
    "services/BaseService",
    'services/DownloadFileService'
], function (app) {

    var deps = ['$scope', '$stateParams', 'CollectListResource', 'TipsService', "BaseService", "DownloadFileService"];

    function controller($scope, $stateParams, CollectListResource, TipsService, BaseService, DownloadFileService) {

        $scope.collection = {};
        var collectionId = $stateParams.collectionId;
        if (!collectionId) {
            TipsService.show('请先指定要查看的征集!');
        } else {
            getCollection(0);
        }

        //获取征集详情信息
        function getCollection(type) {
            CollectListResource.queryCollect(collectionId).success(function loaded(data) {
                if (type == 1) {
                    $scope.collection.auditState = data.auditState;
                } else {
                    // 加全路径
                    $scope.collection.collectionContent = data.collectionContent.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
                    // <a>标签替换
                    var urls = $scope.collection.collectionContent.match(/<a.*?href=.*?>/g);
                    if (urls) {
                        var replaceUrls = [];
                        for (var i = 0; i < urls.length; i++) {
                            var url = urls[i].match(/<a.*?href=".*?"/)[0].replace(/<a.*?href="/, '').replace(/"/, '');
                            url = "<a href=" + "javascript:openWindow('" + url + "') class='hand'>";
                            replaceUrls.push(url);
                        }
                        for (var i = 0; i < urls.length; i++) {
                            $scope.collection.collectionContent = $scope.collection.collectionContent.replace(urls[i], replaceUrls[i]);
                        }
                    }
                    $scope.collection = data;
                }
            });
        }

        //点赞
        $scope.taskPraise = function taskPraise(collection) {
            CollectListResource.assistCollect(collection.collectionId).success(function (response) {
                collection.praiseState = !collection.praiseState;
                collection.praiseCount = response;
            });
        };

        //关注
        $scope.attentionTask = function attentionTask(collection) {
            CollectListResource.attentionCollect(collection.collectionId).success(function (response) {
                collection.attentionState = !collection.attentionState;
                collection.attentionCount = response;
            });
        };

        //我负责的参政议政-提交
        $scope.submitWfzdczyz = function (collection) {
            $.confirm("提交后将不能取消，确定提交这个征集？", "确认提交", function () {
                CollectListResource.submitAuditCollection(collection.collectionId).success(function (response) {
                    if (response) {
                        $.toast("已提交!");
                        getCollection(1);
                    }
                });
            }, function () {
                getCollection(0);
            });
        };

        //我负责的参政议政-催办
        $scope.urgeCollection = function (collection) {
            CollectListResource.remindersCollection(collection.collectionId).success(function (resp) {
                if (resp) {
                    $.toast("催办已发送!");
                }
            });
        };

        //下载附件
        $scope.downLoadAttach = function downLoadAttach(attachId, attachName) {
            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attachId;
            DownloadFileService.downloadFiletoDisk(url, attachName);
        }
    }

    controller.$inject = deps;
    return app.lazy.controller('MyResponsibleCollectDetailController', controller);
});
