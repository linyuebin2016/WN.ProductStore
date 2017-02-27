/**
 * Created by chenweizhi2 on 2016/12/20.
 */
define(["app", "services/BaseService"], function (app) {
    var deps = ["$http", "BaseService"];

    function resource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "discussionController/", BaseService.restfulUrl + "homePageContorller/");
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, url, noticeUrl) {

        return {
            // 获取对应的回复评论列表
            //  @param contextId
            //  @param contextType
            //  上下文类型
            //  1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：声音：学员之声
            //  @param pageNo
            //  @param pageSize
            getDiscussionReplyList: function (contextId, contextType, pageNo, pageSize) {
                return $http.get(url + "getDiscussionReplyList", {
                    params: {
                        contextId: contextId,
                        contextType: contextType,
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            },
            // 保存回复评论
            // topicId:
            // contextId:上下文对象ID *
            // contextType:上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：声音：学员之声；*
            // commentContent:评论内容*
            // topicItemId:评论对应ID
            // commentUserId:评论人ID
            // commentUserPicId:评论人对应的图片ID
            // commentUserName:评论人名称
            // commentUserOrg:评论人对应组织
            // commentDate:评论时间
            // replyUserId:回复人ID *
            // replyUserName:回复人名称
            // adoptState:是否被采纳：采纳状态 true被采纳，false未被采纳
            // replyContent：被回复内容 *
            // contextCreateUserId:上下文（详情）创建人ID *
            saveDiscussionReply: function (discussionReplyVo) {
                return $http.post(url + "saveDiscussionReply", angular.toJson(discussionReplyVo), {
                    transformRequest: angular.identity
                    // ,
                    // transformResponse: function (resp) {
                    //     return resp;
                    // }
                });
            },
            // Description: 设置求医问药的回复被采纳
            // @param contextId 当前求医问药对应的ID
            // @param topicItemId 当前求医问药对应回复评论的ID
            // @return true为成功设置采纳，false为没设置成功（可能因为用户、对象不存在）
            setDiscussionMutualAdopt: function (contextId, topicItemId) {
                return $http.post(url + "setDiscussionMutualAdopt", {
                    contextId: contextId,
                    topicItemId: topicItemId
                }, {
                    headers: postHeader
                });
            },
            // Description: 设置当前用户发布的评论为隐藏（不可显示）状态
            // @param topicItemId 当前评论的ID
            setDiscussionReplyState: function (topicItemId) {
                return $http.post(url + "setDiscussionReplyState", {
                    topicItemId: topicItemId
                }, {
                    headers: postHeader
                });
            },
            // 获取当前用户评论通知回复未读数
            getUserReplyNoticeNoReadCount: function () {
                return $http.get(noticeUrl + "getUserReplyNoticeNoReadCount");
            },
            // 获取当前用户评论回复列表
            getUserReplyNoticeList: function (pageNo, pageSize) {
                return $http.get(noticeUrl + "getUserReplyNoticeList", {
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize
                    }
                });
            }
        };
    }

    resource.$inject = deps;
    app.lazy.factory("DiscussionResource", resource);
})
;
