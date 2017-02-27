/**
 * Created by chenweizhi2 on 2016/12/28.
 */

define(['app',
    'lodash',
    'services/BaseService'
], function (app) {

    var deps = ['$state', 'BaseService'];

    function Service($state, BaseService) {
        // 服务端文件上传路径
        var uploadUrl = BaseService.restfulUrl + 'fileUploadController/attachsUpload';

        var xhr = null;

        return {
            // 检测文件类型
            // audio/mp3,audio/wav
            checkFileType: function (types, fileType) {
                if (angular.isArray(types)) {
                    var index = _.findIndex(types, function (o) {
                        return o == fileType;
                    });
                    return index > -1;
                } else {
                    return types == fileType;
                }
            },
            // 检测文件大小
            // file:文件file.files[0]
            // limitSize:文件大小,默认：5MB
            checkFileSize: function (file, limitSize) {
                var fileSize = file.size;
                if (!limitSize) {
                    limitSize = 5;
                }

                // MB
                if (fileSize > limitSize * (1024 * 1024)) {
                    return {state: false, msg: "体积过大，上传文件体积限制为" + limitSize + "MB以内"};
                }

                var fileSizeText = "";
                if (fileSize > 1024 * 1024) {
                    fileSizeText = (Math.round(fileSize * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                }
                else {
                    fileSizeText = (Math.round(fileSize * 100 / 1024) / 100).toString() + 'KB';
                }

                return {state: true, msg: fileSizeText};
            },
            // 单文件上传
            // file:文件file.files[0]
            // uploadProgress:上传进度事件
            // uploadSuccess：成功回调事件evt.target.responseText
            // uploadFailed：失败回调事件
            uploadOneFile: function (file, uploadProgress, uploadSuccess, uploadFailed) {
                var fd = new FormData();
                fd.append("file", file);

                xhr = new XMLHttpRequest();
                // xhr.upload.addEventListener("progress",uploadProgress);
                // xhr.addEventListener("load",uploadSuccess);
                // xhr.addEventListener("error",uploadFailed);

                xhr.upload.onprogress = uploadProgress;
                xhr.onload = uploadSuccess;
                xhr.onerror = uploadFailed;

                xhr.open("POST", uploadUrl, true);//post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                xhr.send(fd);
            },
            // 取消文件上传
            cancelUploadFile: function () {
                if (xhr) {
                    xhr.abort();
                }
            }
        };
    }

    Service.$inject = deps;
    app.lazy.service("XHRFileUploadService", Service);
});