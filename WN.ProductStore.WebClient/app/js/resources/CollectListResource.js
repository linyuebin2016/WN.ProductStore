/**
 * Created by zhuyunfeng on 16-11-11.
 */
define(["app", "services/BaseService"], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "collectionController/");
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, collectUrl) {
        return {
            /// <summary>方法——获取置顶征集</summary>
            queryTopCollect: function () {
                return $http.get(collectUrl + "getTopCollection");
            },

            /// <summary>方法——获取征集列表</summary>
            queryCollectList: function (collectName, collectionState, order, asc, pageNo, pageSize) {
                return $http.get(collectUrl + "getCollectionList", {
                    params: {
                        collectionName: collectName,
                        collectionState: collectionState,
                        orders: order,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            /// <summary>方法——获取我负责的征集列表</summary>
            queryPrincipalCollectList: function (collectionState, order, asc, pageNo, pageSize) {
                return $http.get(collectUrl + "getMyDirectorCollectionList", {
                    params: {
                        collectionState: collectionState,
                        orders: order,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            /// <summary>方法——获取我参与的征集列表</summary>
            queryEnterCollectList: function (collectionState, order, asc, pageNo, pageSize) {
                return $http.get(collectUrl + "getMyParticipantCollectionList", {
                    params: {
                        collectionState: collectionState,
                        orders: order,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            /// <summary>方法——获取我关注的征集列表</summary>
            queryAttentionCollectList: function (order, asc, pageNo, pageSize) {
                return $http.get(collectUrl + "getMyAttentionCollectionList", {
                    params: {
                        orders: order,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },

            /// <summary>方法——获得征集条数</summary>
            countCollect: function (collectionState, userType) {
                return $http.get(collectUrl + "getCollectionCount", {
                    params: {
                        userType: userType,
                        collectionState: collectionState

                    }
                });
            },

            /*
             * 根据征集ID获取征集详细信息
             */
            queryCollect: function (collectionId) {
                return $http.get(collectUrl + "getCollectionById", {
                    params: {
                        collectionId: collectionId
                    }
                });
            },

            /*
             * 根据征集ID获取征集详细信息
             */
            getCollectionById: function (collectionId) {
                return $http.get(collectUrl + "getCollectionById", {
                    params: {
                        collectionId: collectionId
                    }
                });
            },

            // <summary>方法——点赞征集</summary>
            assistCollect: function (collectId) {
                return $http.get(collectUrl + "likesCollection", {
                    params: {
                        collectionId: collectId
                    }
                });
            },

            /// <summary>方法——关注征集</summary>
            attentionCollect: function (collectId) {
                return $http.get(collectUrl + "attentionCollection", {
                    params: {
                        collectionId: collectId
                    }
                });
            },

            /// <summary>方法——报名征集</summary>
            enterCollect: function (collectId) {
                return $http.get(collectUrl + "enrollCollection", {
                    params: {
                        collectionId: collectId
                    }
                });
            },
            /// <summary>方法——获得征集负责人</summary>
            principalCollect: function (collectId) {
                return $http.get(collectUrl + "principalCollect", {
                    params: {
                        collectionId: collectId
                    }
                });
            },
            /// <summary>方法——获得征集参与人</summary>
            participatorCollect: function (collectId) {
                return $http.get(collectUrl + "participatorCollect", {
                    params: {
                        collectionId: collectId
                    }
                });
            },
            /// <summary>方法——获得征集附件列表信息</summary>
            attachCollect: function (collectId) {
                return $http.get(collectUrl + "attachCollect", {
                    params: {
                        collectionId: collectId
                    }
                });
            },

            /**上传附件 */
            saveCollectionSubmitMaterial: function (collectionId, fd) {
                return $http.post(collectUrl + "saveCollectionSubmitMaterial?" + $.param({
                    collectionId: collectionId
                }), fd, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                });
            },

            /**提交征集 */
            submitAuditCollection: function (collectionId) {
                return $http.get(collectUrl + "submitAuditCollection", {
                    params: {
                        collectionId: collectionId
                    }
                });
            },

            /**催办征集 */
            remindersCollection: function (collectionId) {
                return $http.get(collectUrl + "remindersCollection", {
                    params: {
                        collectionId: collectionId
                    }
                });
            },

            /**删除材料 */
            deleteCollectionSubmitMaterial: function (collectionId, attachId) {
                return $http.get(collectUrl + "deleteCollectionSubmitMaterial", {
                    params: {
                        collectionId: collectionId,
                        attachId: attachId
                    }
                });
            },
            /**获取当前用户没有参与的 已经结束的征集列表：主要用于移动端主页  */
            getCollectionEndStateList: function () {
                return $http.get(collectUrl + "getCollectionEndStateList", {
                    params: {
                        pageNo: 0,
                        pageSize: 100000
                    }
                });
            }

        };
    }
    resource.$inject = deps;
    app.lazy.factory("CollectListResource", resource);
});