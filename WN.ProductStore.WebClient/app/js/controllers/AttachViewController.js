/**
 * Created by zhuyunfeng on 2016/11/29.
 */
define(["app", "jquery",
    "services/BaseService"
], function (app, $, _) {
    var deps = ["$scope", "$timeout", "$stateParams", "BaseService", "UserService"];

    function controller($scope, $timeout, $stateParams, BaseService) {

        $scope.codeLogin().then(function () {
            var url = $stateParams.attachURL;
            var type = $stateParams.type;
            $scope.picURL = null;
            $scope.pdfURL = null;
            $scope.pdfshow = false;
            $scope.picshow = false;
            if (type == "pdf") {
                $scope.pdfshow = true;
                var newurl = BaseService.restfulUrl + "fileUploadController/downFile?fileId=" + url;
                var pdfurl = BaseService.pdfViewUrl + "?file=" + encodeURIComponent(newurl);
                $scope.pdfURL = pdfurl;
            } else if(type == "jpeg" ||type == "bmp" ||type == "gif" || type == "jpg" || type == "png") {
                var attachURL = BaseService.restfulUrl + "fileUploadController/showPic/" + url + "?picType=2";
                $scope.picshow = true;
                $scope.picURL = attachURL;
            }else {
                $scope.pdfshow = true;
                var newurl = BaseService.restfulUrl + "fileUploadController/downPDFFile?fileId=" + url;
                var pdfurl = BaseService.pdfViewUrl + "?file=" + encodeURIComponent(newurl);
                $scope.pdfURL = pdfurl;

            }

            $scope.closePDF = function () {
                window.history.go(-1);
            }
        })

    }

    function init($scope) {

    }

    controller.$inject = deps;
    app.lazy.controller("AttachViewController", controller);
});