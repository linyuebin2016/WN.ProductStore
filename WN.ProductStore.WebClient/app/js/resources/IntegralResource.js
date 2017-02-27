/**
 * Created by xiaojianyong on 2016/12/14.
 */
define(["app"],function(app) {

    var deps = [ "$http", "BaseService" ];

    function noticeResource($http, BaseService) {

        return initResource($http, BaseService.restfulUrl + "user/");
    }
    function initResource($http, baseUrl) {
        return {
            //查询个人积分列表
            getIntegralList : function (orderPorp, orderType, pageNo, pageSize) {
                return $http.get(baseUrl + "getUserIntegralHistoryList" , {
                    params: {
                        orderPorp: orderPorp,
                        orderType: orderType,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            }
        }
    }

    noticeResource.$inject = deps;
    app.lazy.factory("IntegralResource", noticeResource);
});