/**
 * Created by qiushaohua on 15-1-28.
 */
define([
    'app',
    "services/NativeService",
    'controllers/common/ImgViewController'
], function (app) {

    var deps = ['$modal', "NativeService", "BaseService"];

    function directive($modal, NativeService, BaseService) {
        return {
            restrict: 'CA',
            link: function ($scope, elem) {
                elem.on('click', function (event) {
                    var picId = elem.attr('picId');

                    if (!picId || picId == '') {
                        return;
                    }
                    event.stopPropagation();
                    var url = encodeURIComponent(BaseService.restfulUrl + "fileUploadController/showPic/" + picId);
                    NativeService.openWindow("views/common/imgView/NodeWebkitImgView.html?src=" + url + "?picType=3", {
                        title: "图片浏览",
                        toolbar: false,
                        fullscreen: true,
                        transparent: true,
                        "always-on-top": true,
                        resizable: false
                    });
                });
            }
        };
    }

    directive.$inject = deps;
    return app.lazy.directive("fcImageViewable", directive);
});
