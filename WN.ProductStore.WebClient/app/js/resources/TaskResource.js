/**
 * Created by linyuebin on 16.12.07.
 */
define(["app",
    "services/BaseService"
], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + 'socialTaskController');
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl) {

        return {
            /*
             * 获取我报名的任务列表
             */
            getMyParticipatedTaskList: function (model) {
                return $http.get(preUrl + "/getMyParticipatedTaskList", {
                    params: {
                        taskName: model.taskName,
                        taskState: model.taskState,
                        orders: model.orders,
                        asc: model.asc,
                        pageNo: model.pageNo,
                        pageSize: model.pageSize
                    }
                });
                // return $http.get("js/virtualData/myParticipatedTaskList.json", {
                //     params: {
                //         groupName: model.groupName
                //     }
                // });
            },

            /// <summary>方法——获取我关注的列表</summary>
            getMyAttentionTaskList: function (order, asc, pageNo, pageSize) {
                return $http.get(preUrl + "/getMyAttentionTaskList", {
                    params: {
                        orders: order,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            
            /*
             * 获取新的任务列表
             */
            getNewTaskList: function (taskName, taskState, orders, asc, pageNo, pageSize) {
                return $http.get(preUrl + "/getMyNewSocialTaskList", {
                    params: {
                        taskName: taskName,
                        taskState: taskState,
                        orders: orders,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            /*
             * 获取任务动态
             */
            getSocialTaskDynamicList: function (pageNo, pageSize) {
                return $http.get(preUrl + "/getSocialTaskDynamicList", {
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },

            /**
             * 方法——获取我负责的任务列表
             * @param taskName
             * @param taskState
             * @param orders
             * @param asc
             * @param pageNo
             * @param pageSize
             * @returns {*}
             */
            getMyDirectorTaskList: function (taskName, taskState, orders, asc, pageNo, pageSize) {
                return $http.get(preUrl + "/getMyDirectorTaskList", {
                    params: {
                        taskName: taskName,
                        taskState: taskState,
                        orders: orders,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            /**
             * 方法——获取我报名的任务列表(移动端)
             * @param taskName
             * @param taskState
             * @param orders
             * @param asc
             * @param pageNo
             * @param pageSize
             * @returns {*}
             */
            getWbmdTaskList: function (taskName, taskState, orders, asc, pageNo, pageSize) {
                return $http.get(preUrl + "/getMyParticipatedTaskList", {
                    params: {
                        taskName: taskName,
                        taskState: taskState,
                        orders: orders,
                        asc: asc,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            /**
             * 根据任务ID获取对应的详情
             * @param taskId
             */
            getSocialTaskDetailById: function (taskId) {
                return $http.get(preUrl + "/getSocialTaskDetailById", {
                    params: {
                        taskId: taskId
                    }
                });
            },
            /**
             * 任务投票提交
             * @param socialTaskDetailVo
             */
            voteSocialTask: function (socialTaskDetailVo) {
                return $http.post(preUrl + "/voteSocialTask", angular.toJson(socialTaskDetailVo), {
                    transformRequest: angular.identity,
                    transformResponse: function (resp) {
                        return {
                            state: resp
                        };
                    }
                });
            },
            /**
             * 任务报名人提交材料方法
             * @param taskId
             * @param materialIds
             */
            submitSocialTaskMaterial: function (taskId, fd) {
                return $http.post(preUrl + "/submitSocialTaskMaterial?" + $.param({
                        taskId: taskId
                    }), fd, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                });
            },

            /**
             * 任务点赞or取消点赞
             * @param taskId
             */
            setSocialTaskPraise: function (taskId) {
                return $http.get(preUrl + "/setSocialTaskPraise", {
                    params: {
                        taskId: taskId
                    }
                });
            },
            /**
             * 任务关注or取消关注
             * @param taskId
             */
            setSocialTaskAttention: function (taskId) {
                return $http.get(preUrl + "/setSocialTaskAttention", {
                    params: {
                        taskId: taskId
                    }
                });
            },
            /**
             * 下载任务签到表
             * @param taskId
             */
            downloadSocialTaskSign: function (taskId) {
                return $http.get(preUrl + "/downloadSocialTaskSign", {
                    params: {
                        taskId: taskId
                    }
                });
            },
            /**
             * 任务报名
             */
            enrollSocialTask: function (taskId) {
                return $http.get(preUrl + "/enrollSocialTask", {
                    params: {
                        taskId: taskId
                    }
                });
            },
            /**
             * 删除提交材料方法
             */
            deleteSocialTaskMaterial: function (taskId, materialId) {
                return $http.get(preUrl + "/deleteSocialTaskMaterial", {
                    params: {
                        taskId: taskId,
                        materialId: materialId
                    }
                });
            },

            /**
             * 获取任务打卡人列表
             * @param taskId
             */
            getTaskClockUser: function (taskId) {
                return $http.get(preUrl + "/getSocialTaskClockUserList", {
                    params: {
                        taskId: taskId
                    }
                })
            },

            /**
             * Description:设置任务的打卡状态
             * @param taskId 任务ID
             * @param clockState ：默认为0：未打卡；1为打卡中；2为结束打卡
             * @param clockAddress 负责人打卡位置
             * @param clockLongitude 打卡经 度
             * @param clockLatitude 打卡纬度
             * @param req
             * @return
             */
            setSocialTaskClockState: function (taskId, taskClockState, clockLongitude, clockLatitude) {
                return $http.post(preUrl + "/setSocialTaskClockState", {
                    taskId: taskId,
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
             * Description:根据任务ID获取对应的打卡人列表
             */
            getSocialTaskClockUserList: function (taskId) {
                return $http.get(preUrl + "/getSocialTaskClockUserList", {
                    params: {
                        taskId: taskId
                    }
                })
            },

            /**
             * 报名人点击打卡
             * @param taskId
             * @returns {*}
             */
            rwBmrClock: function (taskId, clockState, clockAddress) {
                return $http.post(preUrl + "/setSocialTaskUserClock", {
                    taskId: taskId,
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
            }

        };
    }

    resource.$inject = deps;
    app.lazy.factory("TaskResource", resource);
});