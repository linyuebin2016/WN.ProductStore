/**
 * Created by zhuyunfeng on 2016/11/16.
 */
define(["app","services/BaseService"
], function(app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "FileUploadController/");
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, collectUrl) {
        return {
            /// <summary>方法——获取置顶征集图片</summary>
            queryTopCollectPic: function(picId,picType) {
                return $http.get(collectUrl + "showPic", {
                    params: {
                        picId:picId,
                        picType:picType
                    }
                });
            },
        };
    }
    resource.$inject = deps;
    app.lazy.factory("CollectListPicResource", resource);
});

