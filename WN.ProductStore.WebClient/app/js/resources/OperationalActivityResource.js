/**
 * Created by linyuebin on 16.12.07.
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
             * 获取新的任务列表顶端广告  1.轮播
             */
            getAdvertisementList: function (showType) {
                return $http.get(preUrl + "/queryOperationalActivitiesByShowType", {
                    params: {
                        showType: showType
                    }
                });
            },

            /*
             * 获取运营活动
             */
            queryOperationalActivity: function (activityId, queryType) {
                return $http.get(preUrl + "/queryOperationalActivity", {
                    params: {
                        activityId: activityId,
                        queryType: queryType
                    }
                });
            },

            /*
             * 获取活动积分规则
             */
            queryIntegralRules: function () {
                return $http.get(preUrl + "/queryIntegralRules", {
                    params: {}
                });
            },

            /**
             * 点赞or取消点赞
             * @param activityId
             */
            setOperationalPraise: function (activityId) {
                return $http.post(preUrl + "/setOperationalPraise", {
                    activityId: activityId
                }, {
                    headers: postHeader
                });
            },
            /**
             * 关注or取消关注
             * @param activityId
             */
            setOperationalAttention: function (activityId) {
                return $http.post(preUrl + "/setOperationalAttention", {
                    activityId: activityId
                }, {
                    headers: postHeader
                });
            },

            /**
             * 报名
             * @param activityId
             */
            enrollOperational: function (activityId) {
                return $http.post(preUrl + "/enrollOperationalActivity", {
                    activityId: activityId
                }, {
                    headers: postHeader
                });
            },
            /*
             * 抽奖方法
             */
            setOperationalActivityAwardUser: function (drawId, awardRound) {
                return $http.get(preUrl + "/setOperationalActivityAwardUser", {
                    params: {
                        activityId: drawId,
                        awardRound: awardRound
                    }
                });
            },
            /*
             * 获取中奖人员列表
             */
            getDrawPersonList: function (drawId) {
                return $http.get(preUrl + "/getActivityAwardUserList", {
                    params: {
                        activityId: drawId
                    }
                });
            },

            /**
             * 报名人点击打卡
             * @param taskId
             * @returns {*}
             */
            setActivityUserClock: function (activityId, clockState, clockAddress) {
                return $http.post(preUrl + "/setActivityUserClock", {
                    activityId: activityId,
                    clockState: clockState,
                    clockAddress: clockAddress
                }, {
                    headers: postHeader,
                    transformResponse: function (data) {
                        return {
                            state: data
                        };
                    }
                });
            },
            /**
             * Description:设置打卡状态
             * @param activityId ID
             * @param clockState ：默认为0：未打卡；1为打卡中；2为结束打卡
             * @param clockAddress 负责人打卡位置
             * @param clockLongitude   打卡经 度
             * @param clockLatitude    打卡纬 度
             * @param req
             * @return
             */
            setActivityClockState: function (activityId, taskClockState, clockLongitude, clockLatitude) {
                return $http.post(preUrl + "/setActivityClockState", {
                    activityId: activityId,
                    taskClockState: taskClockState,
                    clockLongitude: clockLongitude,
                    clockLatitude: clockLatitude
                }, {
                    headers: postHeader//,
                    // transformResponse: function (data) {
                    //     return data;
                    // }
                });
            },
            /**
             * Description:根据ID获取对应的打卡人列表
             */
            getOperateClockUserList: function (activityId) {
                return $http.get(preUrl + "/getOperateClockUserList", {
                    params: {
                        activityId: activityId
                    }
                })
            },
            /**
             * Description:负责人扫码兑奖
             * @param activityId 运营活动ID
             * @param awardRound 中奖轮次
             * @param userId 兑奖人ID
             */
            exchangeAwardGift: function (activityId, awardRound, userId) {
                return $http.post(preUrl + "/exchangeAwardGift", {
                    activityId: activityId,
                    userId: userId,
                    awardRound: awardRound
                }, {
                    headers: postHeader//,
                    // transformResponse: function (data) {
                    //     return data;
                    // }
                });
            },
            /**
             * Description:兑奖人礼品页
             * @param activityId 运营活动ID
             * @param awardRound 中奖轮次
             */
            getAwardGift: function (activityId, awardRound) {
                return $http.get(preUrl + "/getAwardGift", {
                    params: {
                        activityId: activityId,
                        awardRound: awardRound
                    }
                })
            },
            /**
             * Description:扣除积分兑奖礼品
             * @param activityId 运营活动ID
             * @param awardRound 中奖轮次
             */
            exchangeGift: function (activityId, awardRound) {
                return $http.post(preUrl + "/exchangeGift", {
                    activityId: activityId,
                    awardRound: awardRound
                }, {
                    headers: postHeader//,
                    // transformResponse: function (data) {
                    //     return data;
                    // }
                });
            }

        };
    }

    resource.$inject = deps;
    app.lazy.factory("OperationalActivityResource", resource);
});