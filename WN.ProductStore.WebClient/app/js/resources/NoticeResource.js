/**
 * Created by xiaojianyong on 2016/11/25.
 */
define(["app"],function(app) {

	var deps = [ "$http", "BaseService" ];

	function noticeResource($http, BaseService) {

		return initResource($http, BaseService.restfulUrl + "notice/");
	}
	var requestHeader = {
		"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
	};
	var postHeader = {
		"Content-Type" : "application/json;charset=utf-8"
	};

	function initResource($http, baseUrl) {
		return {
			//通知个数
			countUserNotice: function () {
				return $http.get(baseUrl + "countUserNotice")
			},
			//查询个人通知列表
			queryCategoryNoticeInfo : function () {
				return $http.get(baseUrl + "queryCategoryNoticeInfo")
			},

			//查询个人通知列表
			queryUserNotices : function (categoryId,tiemStamp,pageSize) {
				return $http.get(baseUrl + "queryUserNotices" , {
					params : {
						categoryId: categoryId,
						tiemStamp: tiemStamp,
						pageSize : pageSize
					}
				});
			}
		}
	}

		noticeResource.$inject = deps;
	app.lazy.factory("NoticeResource", noticeResource);
});