/**
 * Created by zhuyunfeng on 2017/1/11.
 */
define(["app",
    "services/BaseService"
], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + 'operationalActivity');
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl) {

        return {
            /*
             * 抽奖方法
             */
            setOperationalActivityAwardUser: function (drawId,awardRound) {
                return $http.get(preUrl + "/setOperationalActivityAwardUser",{
                    params :{
                        activityId: drawId,
                        awardRound:awardRound
                    }
                });
            }
        };
    }

    resource.$inject = deps;
    app.lazy.factory("DrawResource", resource);
});