/**
 * 分类
 * Created by xiaojianyong on 2016/11/18.
 */

define(["app", "services/BaseService"], function (app, BaseService) {

    var deps = ["$http", "BaseService"];
    
    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "user/");
    }

    var headers = {
        "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, url) {
        return {
            //查询所有分类
            queryUserCategorys : function() {
            	return $http.get(url + "queryUserCategorys");
            }
        };
    }

    resource.$inject = deps;
    return app.lazy.service("CatalogResource", resource);
});