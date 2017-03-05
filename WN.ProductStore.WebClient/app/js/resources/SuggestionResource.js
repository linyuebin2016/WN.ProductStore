/**
 * 我的声音
 * Created by shengxiangyang on 2016-12-21.
 */
define(["app", "services/BaseService"
], function(app) {
     var deps = ["$http", "BaseService"];

     function resource($http, BaseService) {
         return initResource($http, BaseService.restfulUrl + 'discussionController');
     }

     var postHeader = {
         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
     };

     function initResource($http, preUrl) {
         return {

             /**
              * 发表我的声音
              * @param disscussionVo
              * @returns {*}
              */
             saveMySuggestion: function(disscussionVo) {
                 return $http.post(preUrl + "/saveDiscussionInfo", angular.toJson(disscussionVo), {
                     transformRequest: angular.identity,
                     transformResponse: function (resp) {
                         return resp;
                     }
                 });
             },

             /**
              * 获取我的声音列表
              * @param pageNo
              * @param pageSize
              * @returns {*}
              */
             getMySuggestionList: function(pageNo,pageSize) {
                 return $http.get(preUrl + "/getDiscussionVoiceList", {
                     params: {
                         pageNo: pageNo,
                         pageSize: pageSize
                     }
                 })
             },

             /**
              * 获取声音详细信息
              * @param contextId
              * @returns {*}
              */
             getSuggestionDetailById: function(contextId) {
                 return $http.get(preUrl + "/getDiscussionDetailById", {
                     params: {
                         contextId: contextId
                     }
                 })
             },

             /**
              * 搜索我的声音发送的组织
              * @param searchOrgName
              * @returns {*}
              */
             searchOrgByOrgName: function(searchOrgName) {
                 return $http.get(preUrl + "/getDiscussionVoiceOrgList", {
                     params: {
                         searchOrgName: searchOrgName
                     }
                 })
             },

             /**
              * 获取基层声音列表
              * @param pageNo
              * @param pageSize
              * @returns {*}
              */
             getBasicSuggestionList: function(pageNo,pageSize) {
                 return $http.get(preUrl + "/getMyBasicVoiceList", {
                     params: {
                         pageNo: pageNo,
                         pageSize: pageSize
                     }
                 })
             },

             /**
              * 答复我的基层声音
              * @param contextId
              * @param reviewContent
              * @returns {*}
              */
             replyBasicSuggestion: function(contextId,reviewContent) {
                 return $http.post(preUrl + "/setMyBasicVoiceReply", {
                     contextId: contextId,
                     reviewContent: reviewContent
                 }, {
                     headers: postHeader
                 });
             }
         }
     }
    resource.$inject = deps;
    app.lazy.factory("SuggestionResource", resource);
});
