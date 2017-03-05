/**
 * Created by Jon on 2017/1/3.
 */
define(["app"],function(app) {

	var deps = [ "$http", "BaseService" ];

	function HomePageResource($http, BaseService) {

		return initResource($http, BaseService.restfulUrl + "homePageContorller/");
	}

	function initResource($http, baseUrl) {
		return {
			/**获取当前关注总数 */
			getUserAttentionCount: function () {
				return $http.get(baseUrl + "getUserAttentionCount")
			}
		}
	}

	HomePageResource.$inject = deps;
	app.lazy.factory("HomePageResource", HomePageResource);
});