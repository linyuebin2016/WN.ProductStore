/**
 * 用途说明：我的声音resource
 * Author：liuzhi2 on 14-5-12
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
            //查询分类列表
        	getListByTypeCode : function(btype) {
            	return $http.get(url + "getListByTypeCode", {
                    params: {
                        btype:btype
                    }
                });
            },
            //根据类别和类型值查询分类列表
        	getListByTypeCodeAndValue : function(btype,keyWord) {
            	return $http.get(url + "getListByTypeCode", {
                    params: {
                        "btype": btype,
                        "keyWord": keyWord
                    }
                });
            },
            //根据类别和类型值查询分类对象
            //getTypedefByCodeAndValue : function(btype,stype) {
            //	return $http.post(url + "getTypedefByCodeAndValue",{
           	//	 "btype":btype,
           	//	 "stype":stype
            //    }, {
            //        headers: headers
            //    });
            //}
        };
    }

    resource.$inject = deps;
    return app.lazy.service("TypeDefResource", resource);
});