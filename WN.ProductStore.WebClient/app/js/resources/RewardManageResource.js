/**
 * Created on 16.12.07.
 */
define(["app",
    "services/BaseService"
], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + 'membersRewardController');
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl) {

        return {

        	/*
        	 * 获取被打赏数
        	 */
            getRewardCount: function () {
                return $http.get(preUrl + "/getMemberRewardRecordList",{
                    params :{
                    	rewardType:1,
                    	orders:0,
                    	asc:0,
                    	pageNo:1,
                    	pageSize:1
                    }
                });            	
            },
        	/*
        	 * 获取打赏明细
        	 */
            getRewarList: function (rewardType,orders,asc,pageNo,pageSize) {
                return $http.get(preUrl + "/getMemberRewardRecordList",{
                    params :{
                    	rewardType:rewardType,
                    	orders:orders,
                    	asc:asc,
                    	pageNo:pageNo,
                    	pageSize:pageSize
                    }
                });
            }
            
            
        };
    }

    resource.$inject = deps;
    app.lazy.factory("RewardManageResource", resource);
});