/**
 * 分类
 * Created by xiaojianyong on 2016/11/18.
 */

define(["app", "services/BaseService"], function (app, BaseService) {

    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "channel/");
    }

    var headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, url) {
        return {
            /*
             * 获取推荐咨询号列表
             */
            queryRecommendChannels: function (model) {
                return $http.get(url + "queryRecommendChannels", {
                    params: {
                        pageNo: model.pageNo,
                        pageSize: model.pageSize,
                        keyWord: model.keyword,
                        orderProp: model.orderProp,
                        orderType: model.orderType
                    }
                });
                // return $http.get("js/virtualData/channelRecommend.json", {
                //     params: {
                //         groupName: model.groupName
                //     }
                // }); 
            },

            /**关注咨询号 */
            subscribeChannel: function subscribelChannel(groupId) {
                return $http.get(url + "subscribeChannel", {
                    params: {
                        groupId: groupId
                    }
                });
            }
        };
    }

    resource.$inject = deps;
    return app.lazy.service("ChannelRecommendResource", resource);
});