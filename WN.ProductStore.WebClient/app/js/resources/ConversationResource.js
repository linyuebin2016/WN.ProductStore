/**
 * Created by qiushaohua on 14-3-14.
 */
define(["app", "angular", "services/BaseService"], function(app, angular) {

    var deps = ["$http", "BaseService"];

    var headers = {
        "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
    };

    function conversationResource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "conversation/", headers);
    }

    function initResource($http, url, headers) {
        var query = {
            queryPerson: function(userId, timeStamp, pageSize) {
                return $http.get(url + "queryPersonConver", {
                    params: {
                        userId: userId,
                        timeStamp: timeStamp,
                        pageSize: pageSize
                    }
                });
            },

            queryGroup: function(groupId, timeStamp, pageSize) {
                return $http.get(url + "queryGroupConver", {
                    params: {
                        groupId: groupId,
                        timeStamp: timeStamp,
                        pageSize: pageSize
                    }
                });
            },

            queryTopic: function(topicId, timeStamp, pageSize) {
                return $http.get(url + "queryConversationList", {
                    params: {
                        topicId: topicId,
                        timeStamp: timeStamp,
                        pageSize: pageSize
                    }
                });
            },

            queryTask: function(taskId, timeStamp, pageSize) {
                return $http.get(url + "queryConversation", {
                    params: {
                        contextId: taskId,
                        converType: 1,
                        timeStamp: timeStamp,
                        pageSize: pageSize
                    }
                });
            },

            queryDiscuss: function(discussId, timeStamp, pageSize) {
                return $http.get(url + "queryConversation", {
                    params: {
                        contextId: discussId,
                        converType: 2,
                        timeStamp: timeStamp,
                        pageSize: pageSize
                    }
                });
            },

            //queryOrg: function(orgId, timeStamp, pageSize) {
            //    return $http.get(url + "queryConversation", {
            //        params: {
            //            contextId: orgId,
            //            converType: 3,
            //            timeStamp: timeStamp,
            //            pageSize: pageSize
            //        }
            //    });
            //},

            querySpace: function(spaceId, timeStamp, pageSize) {
                return $http.get(url + "queryConversation", {
                    params: {
                        contextId: spaceId,
                        converType: 4,
                        timeStamp: timeStamp,
                        pageSize: pageSize
                    }
                });
            }
        };

        return {
            query: function(id, timeStamp, pageSize) {
                if (id.topicId) {
                    return query.queryTopic(id.topicId, timeStamp, pageSize);
                }
                if (id.groupId) {
                    return query.queryGroup(id.groupId, timeStamp, pageSize);
                }
                if (id.userId) {
                    return query.queryPerson(id.userId, timeStamp, pageSize);
                }
                if (id.taskId) {
                    return query.queryTask(id.taskId, timeStamp, pageSize);
                }
                if (id.discussId) {
                    return query.queryDiscuss(id.discussId, timeStamp, pageSize);
                }
                if (id.orgId) {
                    return query.queryOrg(id.orgId, timeStamp, pageSize);
                }
                if (id.spaceId) {
                    return query.querySpace(id.spaceId, timeStamp, pageSize);
                }
                return null;
            },

            updateUser: function(topicId, addUserIds, removeUserIds) {
                return $http.post(url + "updateAffiliatedUser", {
                    topicId: topicId,
                    addUserIds: addUserIds,
                    removeUserIds: removeUserIds
                }, {
                    headers: headers
                });
            },

            updateTitle: function(topicId, title) {
                return $http.post(url + "updateTitle", {
                    topicId: topicId,
                    title: title
                }, {
                    headers: headers
                });
            },

            setConversationReaded: function(topicId, isSync) {
                return $http.get(url + "setConversationReaded", {
                    params: {
                        topicId: topicId,
                        syncMessage: isSync
                    }
                });
            },

            // 名片转发展示数据接口，cardId = userId || groupId
            queryCardInfo: function(cardId) {
                return $http.get(url + "queryCardInfo", {
                    params: {
                        cardId: cardId
                    }
                });
            },

            /*消息置顶，type=0不置顶，type=1置顶*/
            setConverTop: function(topicId, type) {
                return $http.get(url + "setConverTop", {
                    params: {
                        topicId: topicId,
                        type : type
                    }
                });
            },

            retractConversation: function(topicItemId) {
                return $http.get(url + "retractConversation", {
                    params: {
                        topicItemId: topicItemId
                    }
                });
            },

            queryImageConversation: function(topicId, picId, type, timeStamp){
                return $http.get(url + "queryImageConversation", {
                    params: {
                        topicId: topicId,
                        picId: picId,
                        type: type,
                        timeStamp: timeStamp
                    }
                });
            },
            saveToSelfYunpan: function(password, fileId){
                return $http.get(url + "saveToCloud", {
                    params: {
                        password: password,
                        fileId: fileId
                    }
                });
            },

            // 修改群组头像
            updateTopicPicId: function(topicId, picId){
                return $http.get(url + "updateTopicPicId", {
                    params: {
                        topicId: topicId,
                        picId: picId
                    }
                });
            },

            // 删除消息，仅限与机器人的消息和正式群管理员删除群组内消息
            removeConversationDialogue: function(topicId, topicItemId){
                return $http.get(url + "removeConversationDialogue", {
                    params: {
                        topicId: topicId,
                        topicItemId: topicItemId
                    }
                });
            }
        };
    }

    conversationResource.$inject = deps;
    return app.lazy.service("ConversationResource", conversationResource);
});
