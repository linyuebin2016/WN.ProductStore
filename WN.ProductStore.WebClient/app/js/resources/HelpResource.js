//linyuebin 2016.12.21

define(["app"], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initInfoAccountResource($http, BaseService.restfulUrl + "discussionController/", BaseService.restfulUrl, BaseService.formHeader);
    }

    function initInfoAccountResource($http, url, restfulUrl, formHeader) {
        return {

            /**
             * 保存对象：互助（求医问答）；话题
             * @param socialTaskDetailVo
             * 返回保存成功后的ID 
             */
            saveDiscussionInfo: function (param) {
                return $http.post(url + "saveDiscussionInfo", angular.toJson(param), {
                    transformRequest: angular.identity,
                    transformResponse: function (resp) {
                        return resp
                    }
                });
            },

            // * Description: 获取互助（求医问药）对应的列表
            // 	 * Create Date: 2016年12月20日下午2:51:19
            // 	 * Author     : linyuebin
            // 	 * @param mutualType
            // 	 * 互助显示类别：0代表显示所有的；1表示显示我发布的；2代表显示我回复的（不包括我发布的）
            // 	 * @param
            // 	 * adoptState 是否被采纳
            // 	 * @param pageNo 页码：从1开始
            // 	 * @param pageSize  没有显示的数据数量
            // 	 * @param req
            // 	 * @return
            getDiscussionMutualList: function (param) {
                return $http.get(url + "getDiscussionMutualList", {
                    params: {
                        pageNo: param.pageNo,
                        pageSize: param.pageSize,
                        adoptState: param.adoptState,
                        mutualType: param.mutualType
                    }
                })
            },

            /**获取求助详情 */
            getDiscussionDetailById: function (contextId) {
                return $http.get(url + "getDiscussionDetailById", {
                    params: {
                        contextId: contextId
                    }
                })
            },

            /**获取当前积分 */
            getUserAvailableIntegral: function () {
                return $http.get(url + "getUserAvailableIntegral")
            }
        };
    }

    resource.$inject = deps;
    app.lazy.factory("HelpResource", resource);
});