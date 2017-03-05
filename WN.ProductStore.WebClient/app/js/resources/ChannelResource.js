define(["app"], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initInfoAccountResource($http, BaseService.restfulUrl + "channel/", BaseService.restfulUrl, BaseService.formHeader);
    }

    function initInfoAccountResource($http, url, restfulUrl, formHeader) {
        return {
            uploadCropImage: function (formData, cropParam) {
                return $http.post(restfulUrl + "fileUploadController/saveGroupPic?" + $.param(cropParam), formData, {
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined
                    },
                    transformResponse: function (data) {
                        return {
                            fileId: data
                        };
                    }
                });
            },

            saveChannel: function (account) {
                return $http.post(url + "saveOrUpdateChannel", angular.toJson(account));
            },

            getChannel: function (channelId) {
                return $http.get(url + "queryChannelById", {
                    params: {
                        groupId: channelId
                    }
                });
            },
            updateStatus: function (channelId, status) {
                return $http.get(url + 'updateChannelStatus', {
                    params: {
                        groupId: channelId,
                        status: status
                    }
                });
            },

            removeChannel: function (channelId) {
                return $http.get(url + 'delChannel', {
                    params: {
                        groupId: channelId
                    },
                    transformResponse: function (data) {
                        return {
                            response: data
                        };
                    }
                });
            },

            getSimpleChannels: function (isStop) {
                var params = {};
                if (isStop !== undefined) {
                    params.isStop = isStop;
                }
                return $http.get(url + "querySmpleChannelList", {
                    params: params
                });
            },

            saveChannelItem: function (channelItem) {
                return $http.post(url + "saveChannelItem", angular.toJson(channelItem));
            },

            getChannelItems: function (channelId, pageNo, pageSize) {
                return $http.get(url + "queryChannelItemNew", {
                    params: {
                        groupId: channelId,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },

            removeChannelItem: function (channelItemId) {
                return $http.get(url + 'delChannelItem', {
                    params: {
                        topicItiemId: channelItemId
                    }
                });
            },
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
            },
            //获取我管理的咨询号列表
            getManageChannels: function () {
                return $http.get(url + "queryChannelList", {
                    params: {
                        pageNo: 1,
                        pageSize: 50,
                        keyWord: null
                    }
                });
            },
            //获取我关注的资讯号
            queryMySubscribeChannels: function () {
                return $http.get(url + "queryMySubscribeChannels", {
                    params: {
                        pageNo: 1,
                        pageSize: 50
                    }
                });
            },
            //查询特定咨询号下的咨询列表
            queryChannelItemDetail: function (channelId, title, pageNo, pageSize) {
                return $http.get(url + "queryChannelItemDetail", {
                    params: {
                        groupId: channelId,
                        queryType: "1",
                        pageNo: pageNo,
                        pageSize: pageSize,
                        title: title,
                        orderType: 1
                    }
                });
            },
            //查询特定咨询的明细信息
            getChannelItem: function (channelItemId) {
                return $http.get(url + "queryChannelItemById", {
                    params: {
                        topicItiemId: channelItemId,
                        queryType: 1
                    }
                });
            },
            //点赞资讯信息
            assistItem: function (channelItemId) {
                return $http.get(url + "setChannelItemPraise", {
                    params: {
                        topicItiemId: channelItemId
                    }
                });
            },
            // 检测该组织是否开通资讯号
            isExistOrgChannel: function (orgId) {
                return $http.get(url + "isExistOrgChannel", {
                    params: {
                        orgId: orgId
                    }
                });
            },
            /**取消关注咨询号 */
            unSubscribeChannel: function (groupId) {
                return $http.get(url + "unsubscribeChannel", {
                    params: {
                        groupId: groupId
                    }
                });
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
    app.lazy.factory("ChannelResource", resource);
});