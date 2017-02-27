define(['app',
    "lodash",
    "resources/FileuploadResource",
    "services/BaseService",
    "services/NativeService",
    "services/MessageBox",
    "services/UserService",
    "services/DownloadFileService",
    'directives/NgContextMenu',
    "directives/attachs/AttachsDisplay"
], function(app, _) {

    var deps = ["FileuploadResource", "BaseService", "DownloadFileService", "NativeService", "MessageBox", "UserService"];

    function fileDisplayFun(FileuploadResource, BaseService, DownloadFileService, NativeService, MessageBox, UserService) {
        return {
            replace: true,
            templateUrl: "views/common/fileupload/FileDisplay.html",
            scope: {
                idConfig: "=idConfig",
                removeAble: "=?",
                fileAttachs: "=?"
            },
            link: function($scope, element, attrs) {
                $scope.attachs = [];
                $scope.currentUser = UserService.getCurrentUser();
                $scope.$watch(attrs.idConfig, function() {
                    if ($scope.idConfig != null) {
                        var idType = $scope.idConfig["idType"],
                            id = $scope.idConfig["id"];
                        if (idType == "taskId") {
                            FileuploadResource.queryTaskAttachs(id).success(function(data) {
                                // 拆分显示附件列表
                                $scope.attachs = data;
                                $scope.fileAttachs = data;
                            });
                        }
                    }
                });
                $scope.$on("event.task.upload", function(event) {
                    var id = $scope.idConfig["id"];
                    // 拆分显示附件列表
                    FileuploadResource.queryTaskAttachs(id).success(function(data) {
                        // 拆分显示附件列表
                        $scope.attachs = data;
                    });
                });

                $scope.$on("event.attach.remove", function(event, data) {
                    if ($scope.idConfig != null) {
                        var idType = $scope.idConfig["idType"],
                            id = $scope.idConfig["id"];
                        FileuploadResource.delAttachs(idType, id, data.attachsId).success(function(result) {
                            if (result === "true" && data.callback) {
                                data.callback();
                            }
                        });
                    }
                });

                $scope.isAttachOwner = function(attach) {
                    if (attach && attach.userId == $scope.currentUser.userId) {
                        return true;
                    }
                    return false;
                }

                $scope.openTaskFile = function(event, attach) {
                    var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attach.attachsId;
                    var fileName = DownloadFileService.getLastDir() + "\\" + attach.attachsName;
                    DownloadFileService.downloadfile(url, fileName, true);
                    event.stopPropagation();
                };

                $scope.removeAttach = function(event, attach) {
                    var attachsId = attach.attachsId;
                    var dialog = MessageBox.confirm("确定删除附件？");
                    dialog.result.then(function(data) {
                        var idType = $scope.idConfig["idType"],
                            id = $scope.idConfig["id"];
                        FileuploadResource.delAttachs(idType, id, attachsId).success(function(result) {
                            if (result == true) {
                                var index = _.findIndex($scope.attachs, function(attach) {
                                    return attach.attachsId == attachsId
                                })
                                if (index != -1) {
                                    $scope.attachs.splice(index, 1);
                                }
                            }
                        });
                    });
                    if (event) {
                        event.stopPropagation();
                    }
                };

                $scope.showMenu = function(event, attach) {
                    var win = NativeService.win;
                    var gui = NativeService.gui;
                    var menu = new gui.Menu();
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '打开',
                        click: function() {
                            var os = require('os');
                            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attach.attachsId;
                            var fileName = os.tmpdir() + "\\" + attach.attachsName;
                            DownloadFileService.downloadfile(url, fileName, true);
                        }
                    }));
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '下载',
                        click: function() {
                            var url = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + attach.attachsId;
                            DownloadFileService.downloadFiletoDisk(url, attach.attachsName);
                        }
                    }));
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '删除',
                        click: function() {
                            $scope.removeAttach(event, attach.attachsId);
                        }
                    }));
                    menu.popup(event.originalEvent.x, event.originalEvent.y);
                    event.stopPropagation();
                };
            }
        };
    }

    fileDisplayFun.$inject = deps;

    app.lazy.directive('fcFileDisplay', fileDisplayFun);
});
