define(['app',
    'angular',
    'services/common/CacheService'
], function(app, angular) {
    var deps = ['$http', 'BaseService', "$rootScope", 'CacheService', '$q'];

    function resource($http, BaseService, $rootScope, CacheService, $q) {
        return initInfoAccountResource($http, BaseService.restfulUrl, BaseService.formHeader, $rootScope, CacheService, $q);
    }

    function initInfoAccountResource($http, url, formHeader, $rootScope, CacheService, $q) {
        var query = {
            queryPerson: function(userId, timeStamp, pageSize, isBefore) {
                var deferred = $q.defer();
                $http.get(url + 'conversation/queryPersonConver', {
                    params: {
                        userId: userId,
                        timeStamp: timeStamp,
                        pageSize: pageSize,
                        type: isBefore
                    }
                }).success(function(topic) {
                    deferred.resolve(topic);
                });
                return deferred.promise;
            },

            queryGroup: function(groupId, timeStamp, pageSize, isBefore) {
                var deferred = $q.defer();
                $http.get(url + 'conversation/queryGroupConver', {
                    params: {
                        groupId: groupId,
                        timeStamp: timeStamp,
                        pageSize: pageSize,
                        type: isBefore
                    }
                }).success(function(topic) {
                    deferred.resolve(topic);
                });
                return deferred.promise;
            },

            queryTopic: function(topicId, timeStamp, pageSize, isBefore, isCache) {
                var deferred = $q.defer();
                var conversationVo = null;
                if (CacheService.includeConversationCache(topicId) && isCache) {
                    conversationVo = CacheService.getConversationCache(topicId, pageSize, timeStamp);
                    if (conversationVo != null) {
                        deferred.resolve(conversationVo);
                    }
                }
                if (conversationVo == null) {
                    $http.get(url + 'conversation/queryConversationList', {
                        params: {
                            topicId: topicId,
                            timeStamp: timeStamp,
                            pageSize: pageSize,
                            type: isBefore
                        }
                    }).success(function(topic) {
                        CacheService.pushConversationCache(topic);
                        deferred.resolve(topic);
                    });
                }
                return deferred.promise;
            }
        };
        return {
            /**
             * 获取最近会话列表
             * @param pageNo
             * @param pageSize
             */
            queryRecentContacts: function(pageNo, pageSize) {
                return $http.get(url + 'contactsController/queryConverContacts', {
                    params: {
                        replyNeed: 1,
                        pageNo: pageNo || 1,
                        pageSize: pageSize || 10
                    }
                });
            },

            queryContacts: function(searchValue, pageNo, pageSize) {
                return $http.get(url + 'contactsController/queryUserContacts', {
                    params: {
                        searchValue: searchValue,
                        pageNo: pageNo || 1,
                        pageSize: pageSize || 10
                    }
                });
            },

            queryContactsPromise: function(searchValue, pageNo, pageSize){
                var deferred = $q.defer();
                $http.get(url + 'contactsController/queryUserContacts', {
                    params: {
                        searchValue: searchValue,
                        pageNo: pageNo || 1,
                        pageSize: pageSize || 10
                    }
                }).success(function(topic){
                    deferred.resolve(topic);
                })
                return deferred.promise;
            },

            queryUserContactsLikeMobile: function(searchValue, pageNo, pageSize) {
                return $http.get(url + 'contactsController/queryUserContactsLikeMobile', {
                    params: {
                        mobile: searchValue,
                        pageNo: pageNo || 1,
                        pageSize: pageSize || 10
                    }
                });
            },

            query: function(id, timeStamp, pageSize, isBefore) {
                if (id.topicId) {
                    id.isCache = id.isCache == undefined ? true : id.isCache;
                    return query.queryTopic(id.topicId, timeStamp, pageSize, isBefore, id.isCache);
                }
                if (id.groupId) {
                    return query.queryGroup(id.groupId, timeStamp, pageSize, isBefore);
                }
                if (id.userId) {
                    return query.queryPerson(id.userId, timeStamp, pageSize, isBefore);
                }
                return null;
            },

            send: function(conversation) {
                // 发送消息时不显示Load图标
                $rootScope.forbidLoading = true;
                return $http.post(url + 'conversation/saveConversation', angular.toJson(conversation)).success(function(dialogueVo) {
                    setTimeout(function() {
                        $rootScope.forbidLoading = false;
                    }, 100);
                    CacheService.pushConversationCache(dialogueVo);
                }).error(function() {
                    setTimeout(function() {
                        $rootScope.forbidLoading = false;
                    }, 100);
                });
            },

            sendAutoReplyMessage: function(conversation) {
                // 发送消息时不显示Load图标
                $rootScope.forbidLoading = true;
                return $http.post(url + 'conversation/sendAutoReplyMessage', angular.toJson(conversation)).success(function(dialogueVo) {
                    setTimeout(function() {
                        $rootScope.forbidLoading = false;
                    }, 100);
                    CacheService.pushConversationCache(dialogueVo);
                }).error(function() {
                    setTimeout(function() {
                        $rootScope.forbidLoading = false;
                    }, 100);
                });
            },

            forwards: function(conversation) {
                $rootScope.forbidLoading = true;
                return $http.post(url + 'conversation/forwardConversation', angular.toJson(conversation)).success(function(data) {
                    setTimeout(function() {
                        $rootScope.forbidLoading = false;
                    }, 100);
                    CacheService.pushConversationCache(data.dialogueVo);
                }).error(function() {
                    setTimeout(function() {
                        $rootScope.forbidLoading = false;
                    }, 100);
                });
            },
            sendConversationNoticeMessage: function(conversation) {
                return $http.post(url + 'conversation/sendConversationNoticeMessage', angular.toJson(conversation));
            },

            queryConversationByKeyWord: function(searchKey, topicId, size, timeStamp) {
                return $http.get(url + 'conversation/queryConversationByKeyWord', {
                    params: {
                        keyWord: searchKey,
                        topicId: topicId,
                        pageSize: size,
                        timeStamp: timeStamp
                    }
                });
            }
        };
    }

    resource.$inject = deps;
    app.lazy.factory('ChatResource', resource);
});
