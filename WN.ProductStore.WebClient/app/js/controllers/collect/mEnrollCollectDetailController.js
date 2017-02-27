define([
    'app',
    "jquery",
    "jqueryWeUI",
    'resources/CollectListResource',
    "directives/CommentForWx",
    "services/BaseService",
    'services/DownloadFileService',
    "services/UserService"
], function (app, $, _) {

    var deps = ['$scope', '$state', '$stateParams', 'CollectListResource', 'UserService', "BaseService", "DownloadFileService"];

    function controller($scope, $state, $stateParams, CollectListResource, UserService, BaseService, DownloadFileService) {
        /**返回 */
        $scope.goBack = function goBack() {
            window.history.back();
        }
        //处理常见类型的文件图标显示
        $scope.checkFileType = DownloadFileService.checkFileType;

        //setTimeout(function () {$("body").css("background","#fff");},200);

        var currentUser = UserService.getCurrentUser();
        $scope.collection = {};
        $scope.collection.selfSubmitMaterialVo = [];
        $scope.collection.praiseClass = "icon-btn-big";
        $scope.collection.attentionClass = "icon-btn-big";
        var collectionId = $stateParams.collectionId;
        if (!collectionId) {
            $.toast('请先指定要查看的征集!', "forbidden");
        } else {
            getTask();
        }
        function getTask() {
            return CollectListResource.queryCollect(collectionId).success(function loaded(data) {
                $scope.collection = data;
                //点赞
                $scope.collection.praiseClass = "icon-btn-big";
                if (data.praiseState) {
                    $scope.collection.praiseClass = "icon-btn-big active";
                }
                //关注
                $scope.collection.attentionClass = "icon-btn-big";
                if (data.attentionState) {
                    $scope.collection.attentionClass = "icon-btn-big active";
                }

                //本人提交的材料
                $scope.collection.selfSubmitMaterialVo = [];
                if (data.collectionSubmitted) {
                    for (var i = 0; i < data.collectionSubmitted.length; i++) {
                        if (data.collectionSubmitted[i].submitUserId == currentUser.userId) {
                            $scope.collection.selfSubmitMaterialVo.push(data.collectionSubmitted[i]);
                        }
                    }
                }

                //任务内容
                $scope.collection.collectionContent = $scope.collection.collectionContent.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);

            });
        }

        /**点赞 */
        $scope.collectionPraise = function taskPraise() {
            CollectListResource.assistCollect(collectionId).success(function (response) {
                $scope.collection.praiseCount = response;
                $scope.collection.praiseState = !$scope.collection.praiseState;
                $scope.collection.praiseClass = "icon-btn-big";
                if ($scope.collection.praiseState) {
                    $scope.collection.praiseClass = "icon-btn-big active";
                }
            });
        }
        /**关注 */
        $scope.collectionAttention = function taskAttention() {
            CollectListResource.attentionCollect(collectionId).success(function (response) {
                $scope.collection.attentionCount = response;
                $scope.collection.attentionState = !$scope.collection.attentionState;
                $scope.collection.attentionClass = "icon-btn-big";
                if ($scope.collection.attentionState) {
                    $scope.collection.attentionClass = "icon-btn-big active";
                }
            });
        }

        //以下提交材料

        //下载附件
        $scope.downLoadAttach = function downLoadAttach(attachsId, attachsName) {
            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attachsId;
            DownloadFileService.downloadFiletoDisk(url, attachsName);
        }

        //附件预览
        $scope.attachView = function attachView(attachsId, attachsName, attachsType) {
            //跳转到预览页面
            var attachURL = '';
            if (attachsType == "pdf" || attachsType == "jpg" || attachsType == "png") {
                $state.go("home.attachView", {attachURL: attachsId, type: attachsType});
            }
            else {
                $scope.downLoadAttach(attachsId, attachsName);
            }
        }

    }

    controller.$inject = deps;
    return app.lazy.controller('mEnrollCollectDetailController', controller);
});
