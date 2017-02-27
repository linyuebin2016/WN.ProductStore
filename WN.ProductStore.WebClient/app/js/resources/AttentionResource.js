/**
 * 分类
 * Created by xiaojianyong on 2016/11/18.
 */

define(["app", "services/BaseService"], function (app, BaseService) {

    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "homePageContorller/");
    }

    var headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, url) {
        return {
            /*
             * 获取关注类型列表
             */
        	getAttentionTypeList: function () {
                 return $http.get(url + "getUserAttentionType", {
                     params: {}
                 });
            },
            /*
             * 获取关注列表
             */
        	getAttentionList: function (contextId,pageNo,pageSize) {
                 return $http.get(url + "getUserAttentionList", {
                     params: {contextType:contextId,pageNo:pageNo,pageSize:pageSize}
                 });
            },
            /*
             * 取消关注
             */
            cancelUserAttention: function (contextId,contextType) {
                 return $http.get(url + "cancelUserAttention", {
                     params: {contextId:contextId,contextType:contextType}
                 });
            }
        };
    }

    resource.$inject = deps;
    return app.lazy.service("AttentionResource", resource);
});