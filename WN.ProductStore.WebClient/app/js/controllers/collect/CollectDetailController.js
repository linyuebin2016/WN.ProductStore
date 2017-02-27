/**
 * Created by linyuebin on 2016/11/14.
 */
define(["app", "jquery", "jqueryWeUI",
    "resources/CollectListResource",
    "directives/fileupload/FileUpload",
    "directives/CommentForWx",
    "services/TipsService",
    "services/MessageBox",
    "services/DownloadFileService"
], function (app, $) {
    var deps = ["$scope", "$stateParams", "UserService", "CollectListResource", "MessageBox", "BaseService", "DownloadFileService"
    ];

    function controller($scope, $stateParams, UserService, CollectListResource, MessageBox, BaseService, DownloadFileService) {

        $scope.codeLogin().then(function () {
            $scope.currentUser = UserService.getCurrentUser();

            var collectId = $stateParams.collectId;
            $scope.collectionSubmitteds = {};

            if (collectId == undefined || collectId == "") {
                alert("征集id不能为空!");
                return;
            }

            $scope.model = {};
            $scope.model.directorsState = false;

            getCollectionById();

            /**获取详情 */
            function getCollectionById() {
                CollectListResource.queryCollect(collectId).success(function (response) {
                    response.collectionContent = response.collectionContent.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
                    $scope.collectionSubmitteds = response.collectionSubmitted;
                    $scope.model = response;
                    console.log($scope.model);
                }).error(function (error) {
                    MessageBox.error(error);
                });
            }

            /**点赞 */
            $scope.collectAssist = function collectAssist() {
                CollectListResource.assistCollect(collectId).success(function (response) {
                    $scope.model.praiseState = !$scope.model.praiseState;
                    $scope.model.praiseCount = response;
                });
            }

            /**关注 */
            $scope.attentionCollect = function attentionCollect() {
                CollectListResource.attentionCollect(collectId).success(function (response) {
                    $scope.model.attentionState = !$scope.model.attentionState;
                    $scope.model.attentionCount = response;
                });
            }

            /** 报名*/
            // $scope.collectEnter = function collectEnter() {

            //     var d = MessageBox.confirmResult("报名后不能取消，确定报名？");
            //     d.result.then(function (result) {
            //         if (result === "yes") {
            //             CollectListResource.enterCollect(collectId).success(function (response) {
            //                 $scope.model.participantsState
            //                 getCollectionById();
            //             });
            //         }
            //     });
            // }


            /** 报名*/
            $scope.collectEnter = function collectEnter() {
                $.confirm("报名后不能取消，确定报名？", "报名后不能取消，确定报名？", function () {
                    CollectListResource.enterCollect(collectId).success(function (response) {
                        $.toast("已报名!");
                        getCollectionById();
                    });
                }, function () {
                    return false;
                });
            };

            /**返回 */
            $scope.goBack = function goBack() {
                // window.history.back();

                window.history.go(-1);
            }

            /**上传材料 */
            $scope.changefile = function changefile(file) {
                if (file.files[0] == undefined) {
                    return;
                }
                var formData = new FormData();
                formData.append("file", file.files[0]);
                CollectListResource.saveCollectionSubmitMaterial(collectId, formData).success(function (response) {
                    // TipsService.show("上传成功！");
                    $.toast("上传成功！");
                    getCollectionById();
                    file = undefined;
                    formData = undefined;
                });
            }

            /**提交征集 */
            $scope.submitAuditCollection = function submitAuditCollection() {
                if ($scope.collectionSubmitteds == undefined || $scope.collectionSubmitteds.length == 0) {
                    // TipsService.show("您尚未收到上传材料，无需提交征集");
                    $.toast("您尚未收到上传材料，无需提交征集");
                    return;
                }
                // var confirm = MessageBox.confirmResult("确定提交征集？");
                // confirm.result.then(function (result) {
                //     if (result == "yes") {

                //         CollectListResource.submitAuditCollection(collectId).success(function (response) {
                //             getCollectionById();
                //             TipsService.show("征集已提交！");
                //         });
                //     }
                // });
                /** 报名*/

                $.confirm("确定提交征集？", "确定提交？", function () {
                    CollectListResource.submitAuditCollection(collectId).success(function (response) {
                        $.toast("征集已提交！");
                        getCollectionById();
                    });
                }, function () {
                    return false;
                });
            }

            /**催办征集 */
            $scope.remindersCollection = function remindersCollection() {
                CollectListResource.remindersCollection(collectId).success(function (response) {
                    // TipsService.show("已催办！");
                    $.toast("已催办！");
                });
            }

            /**下载附件 */
            $scope.selectPath = function (attach) {
                var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attach.attachId;
                DownloadFileService.downloadFiletoDisk(url, attach.attachName);
            }

            /**删除附件 */
            $scope.deleteCollectionSubmitMaterial = function deleteCollectionSubmitMaterial(attachId, submitUserId) {
                // var d = MessageBox.confirmResult("确定删除？");
                // d.result.then(function (result) {
                //     if ($scope.model.directorState == true || $scope.currentUser.userId == submitUserId) {
                //         if (result === "yes") {
                //             CollectListResource.deleteCollectionSubmitMaterial(collectId, attachId).success(function (response) {
                //                 TipsService.show("已删除！");
                //                 getCollectionById();
                //             }).error(function (error) {
                //                 MessageBox.error(error);
                //             });;
                //         }
                //     } else {
                //         MessageBox.error("无权限删除！");
                //     }
                //     // $scope.currentUser.userId
                // });
                $.confirm("确定删除？", "确定删除？", function () {
                    CollectListResource.deleteCollectionSubmitMaterial(collectId, attachId).success(function (response) {
                        $.toast("已删除！");
                        getCollectionById();
                    });
                }, function () {
                    return false;
                });
            }
        })
    }

    controller.$inject = deps;
    return app.lazy.controller("CollectDetailController", controller);
});