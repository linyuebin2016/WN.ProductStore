/**
 * Created by zhuyunfeng on 2016/11/15.
 */
define(["app","services/BaseService"], function(app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "collectionController/");
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, collectUrl) {
        return {
            /// <summary>方法——得到加精列表</summary>
            getEssenceAttachList: function(attachModel) {
                return $http.get(collectUrl + "getEssenceCollectionList", {
                    params: {
                        essenceMaterialName: attachModel.attachName,
                        collectionLableId:attachModel.attachType,
                        orders : attachModel.sortFilter,
                        asc:attachModel.sortDesc,
                        pageNo: attachModel.pageIndex,
                        pageSize: attachModel.pageSize
                    }
                });
            },
            /// <summary>方法——得到加精类型列表</summary>
            getAttachTypeList: function() {
                return $http.get(collectUrl + "getCollectionEnssenLable");
            },

            // <summary>方法——点赞附件</summary>
            assistAttach: function (collectId,attachId) {
                return $http.get(collectUrl + "setCollectionMaterialPraise", {
                    params: {
                        collectionId: collectId,
                        attachId: attachId
                    }
                });
            },
            /// <summary>方法——关注附件</summary>
            attentionAttach: function (collectId,attachId) {
                return $http.get(collectUrl + "setCollectionMaterialAttention", {
                    params: {
                        collectionId: collectId,
                        attachId: attachId
                    }
                });
            }
        };
    }
    resource.$inject = deps;
    app.lazy.factory("CollectAttachResource", resource);
});

