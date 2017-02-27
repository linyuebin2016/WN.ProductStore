/**
 * Created by linyuebin on 16-11-11.
 */
define(["app",
    "services/BaseService"
], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + 'collectionController');
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl) {

        return {
            /*
             * 参政议政征集归档列表 按创建时间倒序*
             */
            getArchiveCollectionList: function (collectionModel) {
                return $http.get(preUrl + "/getArchiveCollectionList", {
                    params: {
                        collectionName: collectionModel.collectionName,
                        collectionState: collectionModel.collectionState,
                        collectionYear: collectionModel.collectionYear,
                        order: collectionModel.order,
                        /**排序 */
                        pageNo: collectionModel.pageNo,
                        pageSize: collectionModel.pageSize
                    }
                });

            },
            /**年份列表 */
            getArchiveCollectionYear: function () {
                return $http.get(preUrl + "/getArchiveCollectionYear");
            },

            /*
             * 根据征集ID获取征集详细信息
             */
            getCollectionById: function (collectionId) {
                debugger;
                return $http.get(preUrl + "/getCollectionById", {
                    params: {
                        collectionId: collectionId,
                    }
                });
            },
        };
    }

    resource.$inject = deps;
    app.lazy.factory("ArchiveCollectionListResource", resource);
});