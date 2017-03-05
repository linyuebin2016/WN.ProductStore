/**
 * Created by chenweizhi2 on 2016/11/11.
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
            // 获取我的待办事项
            // orders
            // 待办事项：1、参政议政征集的待办：进行中的，并且是参与人或者是负责人的列表
            // 已办事项：2、完成的(成功。失败的）
            getBacklogToDo: function (orders, pageNo, pageSize) {
                return $http.get(collectUrl + "getBacklogToDo", {
                    params: {
                        orders: orders,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            }
        };
    }

    resource.$inject = deps;
    app.lazy.factory("BacklogResource", resource);
});


