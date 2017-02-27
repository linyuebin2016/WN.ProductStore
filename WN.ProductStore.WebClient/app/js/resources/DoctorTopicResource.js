/**
 * Created by wanglisheng on 16.12.21.
 */
define(["app",
    "services/BaseService"
], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + 'discussionController');
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl) {

        return {
            /*
             * 获取用户当前可用积分
             */
        	getUserAvailableIntegral: function () {
                return $http.get(preUrl + "/getUserAvailableIntegral", {
                    params: {}
                });
            },

            /**
             * 保存对象：互助（求医问答）；话题
             * @param socialTaskDetailVo
             * 返回保存成功后的ID 
             */
            saveDiscussionInfo: function (disscussionVo) {
                return $http.post(preUrl + "/saveDiscussionInfo", angular.toJson(disscussionVo), {
                    transformRequest: angular.identity,
                    transformResponse: function (resp) {
                        return resp
                    }
                });
            },

            /*
             * 获取求医问药、讨论 
             */
            getDiscussionDetailById: function (contextId) {
                return $http.get(preUrl + "/getDiscussionDetailById", {
                    params: {
                    	contextId: contextId
                    }
                });
            },

            /*
             * 获取求医问药（求助）移动端主页中对应的我发布的、我回复的求助是否有回复未读
             */
            getDiscussionMutualState: function (contextType) {
                return $http.get(preUrl + "/getDiscussionMutualState", {
                    params: {contextType:contextType}
                });
            },
            
            /*
             * 获取求医问药列表
             */
            getDiscussionMutualList: function (mutualType,pageNo,pageSize) {
                return $http.get(preUrl + "/getDiscussionMutualList", {
                    params: {
                    	mutualType: mutualType,
                    	pageNo: pageNo,
                    	pageSize: pageSize
                    }
                });
            },
            
            /*
             * 获取话题列表
             */
            getDiscussionSubjectList: function (subjectType,pageNo,pageSize) {
                return $http.get(preUrl + "/getDiscussionSubjectList", {
                    params: {
                    	subjectType: subjectType,
                    	pageNo: pageNo,
                    	pageSize: pageSize
                    }
                });
            }
            
        };
    }

    resource.$inject = deps;
    app.lazy.factory("DoctorTopicResource", resource);
});