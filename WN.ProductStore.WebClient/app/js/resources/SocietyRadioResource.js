/**
 * Created by chenweizhi2 on 2016/12/27.
 */

define(["app", "services/BaseService"], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "societyRadio/");
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, url) {

        return {

            // 保存音频
            // title：标题
            // description：描述
            // mediaId：媒体ID【微信端】
            // fileId：文件ID【pc端】
            saveSocietyRadio: function (societyRadioVo) {
                return $http.post(url + "saveSocietyRadio", angular.toJson(societyRadioVo), {
                    transformRequest: angular.identity
                    // ,
                    // transformResponse: function (resp) {
                    //     return resp;
                    // }
                });
            },
            // 音频列表
            querySocietyRadios: function (title, isRecommend, pageNo, pageSize) {
                return $http.get(url + "querySocietyRadios", {
                    params: {
                        // title: title,
                        isRecommend: isRecommend,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            // 我的音频
            queryMySocietyRadios: function (title, pageNo, pageSize) {
                return $http.get(url + "queryMySocietyRadios", {
                    params: {
                        //title: title,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            // 音频详情
            querySocietyRadio: function (radioId) {
                return $http.get(url + "querySocietyRadio", {
                    params: {
                        radioId: radioId
                    }
                });
            },
            // 设置已播放
            incSocietyRadioReadCount: function (radioId) {
                return $http.get(url + "incSocietyRadioReadCount", {
                    params: {
                        radioId: radioId
                    }
                });
            },
            // 点赞
            setSocietyRadioParise: function (radioId, type) {
                return $http.get(url + "setSocietyRadioParise", {
                    params: {
                        radioId: radioId,
                        type: type
                    }
                });
            },
            // 删除音频
            removeSocietyRadio: function (radioId) {
                return $http.get(url + "removeSocietyRadio", {
                    params: {
                        radioId: radioId
                    }
                });
            },
            // 我的音频总数
            countMySocietyRadios: function () {
                return $http.get(url + "countMySocietyRadios");
            },
            
            // 音频详情
            querySocietyRadio: function (radioId, isRecommend) {
                return $http.get(url + "querySocietyRadio", {
                    params: {
                    	radioId:radioId,
                        isRecommend: isRecommend
                    }
                });
            }

        };
    }

    resource.$inject = deps;
    app.lazy.factory("SocietyRadioResource", resource);
});
