/**
 * Created by shengxiangyang on 2017/01/09.
 */
define(["app", "services/BaseService"], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "membersRewardController");
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, url) {

        return {
            /**
             * 获取当前打赏人员的信息列表
             * @param contextId
             * @returns {*}
             */
            getRewardUserList: function (contextId) {
                return $http.get(url + "/getRewardUserMessage", {
                    params: {
                        contextId: contextId
                    }
                });
            },

            /**
             * 获取当前打赏的数量
             * @param contextId
             * @returns {*}
             */
            getRewardCount: function (contextId) {
                return $http.get(url + "/getRewardUserCount", {
                    params: {
                        contextId: contextId
                    }
                });
            },

            /**
             * 获取随机的打赏金额
             * @returns {*}
             */
            getRewardValue: function () {
                return $http.get(url + "/getMemberRewardValue");
            },

            /**
             * 对当前任务进行打赏
             * @param contextId
             * @param contextType
             * @param rewardValue
             * 上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：声音：学员之声；7、好书；8、九三之声
             * @returns {*}
             */

            setRewardValue: function (contextId, contextType, rewardValue) {
                return $http.post(url + "/setMemberRewardValue", {
                    contextId: contextId,
                    contextType: contextType,
                    rewardValue:rewardValue
                }, {
                    headers: postHeader
                });
            },

            /**
             *查询我的零钱是否可以打赏
             * @param rewardValue
             * @returns {*}
             */
            checkWdye: function(rewardValue) {
                return $http.get(url + "/checkUserWalletAmount", {
                   params: {
                       rewardValue:rewardValue
                   }
                });
            }
        };
    }

    resource.$inject = deps;
    app.lazy.factory("RewardResource", resource);
})
;
