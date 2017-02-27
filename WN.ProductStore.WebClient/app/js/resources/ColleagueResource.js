define(['app', 'angular'], function (app, angular) {
    var deps = ['$http', 'BaseService', "$rootScope"];

    function resource($http, BaseService, $rootScope) {
        return initInfoAccountResource($http, BaseService, BaseService.restfulUrl +"colleague/", BaseService.formHeader, $rootScope);
    }

    function initInfoAccountResource($http, base, url, formHeader, $rootScope) {

        return {
            deleteShare: function(_shareId){
                return $http.post(url + 'deleteShare', {
                    shareId: _shareId
                }, {
                    headers: formHeader,
                    transformResponse : function(resp) {
                        return { result: resp};
                    }
                });
            },
            deleteShareComment : function(topicItemId){
                 return $http.post(url + 'deleteShareComment', {
                    topicItemId: topicItemId
                }, {
                    headers: formHeader
                });
            },
            focusUser : function( userId, type) {
                return $http.get(url + 'focusUser', {
                    params: {
                        userId: userId,
                        type: type
                    }
                });
            },
            queryColleagueCircle: function(pageSize, timeStamp) {
                return $http.get(url + 'queryColleagueCircle', {
                    params: {
                        pageSize: pageSize,
                        timeStamp: timeStamp
                    }
                });
            },
            // queryCollectionList: function(pageSize, timeStamp) {
            //     return $http.get(url + 'queryColleagueCircle', {
            //         params: {
            //             pageSize: pageSize,
            //             timeStamp: timeStamp
            //         }
            //     });
            // },
            // queryColleague: function (pageNo, _time) {
            //     return $http.get(url + 'queryColleagueCircle', {
            //         params: {
            //             pageSize: 6,
            //             timeStamp: _time
            //         }
            //     });
            // },
            queryFansList: function(queryUserId, pageNo, pageSize) {
                return $http.get(url + 'queryFansList', {
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        queryUserId: queryUserId
                    }
                });
            },
            queryFocusList : function (queryUserId, pageNo, pageSize) {
                return $http.get(url + 'queryFocusList', {
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        queryUserId: queryUserId
                    }
                });
            },
            queryPersonCenter: function (queryUserId, timeStamp, pageSize) {
                return $http.get(url + 'queryPersonCenter', {
                    params: {
                        pageSize: pageSize,
                        timeStamp: timeStamp,
                        queryUserId: queryUserId
                    }
                });
            },
            queryShareById:function(topicId,timeStamp,pageSize){
                var v = $http.get(url + 'queryShareById',  {
                    params: {
                        topicId: topicId,
                        timeStamp: timeStamp,
                        pageSize:pageSize
                    }
                });
                return v;
            },
            queryShareHistory :function(topicId,timeStamp,pageSize){
                return $http.get(url + 'queryShareHistory',  {
                    params: {
                        topicId: topicId,
                        timeStamp: timeStamp,
                        pageSize:pageSize
                    }
                });
            },
            saveDialogueVoNew:function(DialogueVo){
                return $http.post(url + 'saveDialogueVoNew', angular.toJson(DialogueVo));
            },
            saveShareTopicNew:function(newTopicVo){
                return $http.post(url + 'saveShareTopicNew', angular.toJson(newTopicVo));
            },
            setShareCollectionNew: function(shareId, collectionType){
                return $http.post(url + 'setShareCollectionNew', {
                    shareId : shareId,
                    collectionType : collectionType
                }, {
                    headers: formHeader,
                    transformResponse : function(resp) {
                        return { result: resp};
                    }
                });
            },
            setSharePraiseNew:function(_shareId,_type){
                return $http.post(url + 'setSharePraiseNew', {
                    shareId: _shareId,
                    type:_type
                }, {
                    headers: formHeader
                });
            },

            //获取我的空间
            getMySpaces:function(){
                return $http.get(base.restfulUrl + "space/" + "getMySpacesNew");
            },

            //所有@我的人
            queryAtMyShare:function(pageSize, timeStamp) {
                return $http.get(url + 'queryAtMyShare', {
                    params: {
                        pageSize: pageSize,
                        timeStamp: timeStamp
                    }
                });
            },

            //获取我的收藏
            queryMyCollectionList:function(queryUserId,timeStamp, pageSize){
                return $http.get(url + 'queryCollectionList', {
                    params: {
                        queryUserId: queryUserId,
                        timeStamp: timeStamp,
                        pageSize: pageSize
                    }
                });
            },

            //查询所有用户创建话题
            queryAllHashTag:function(){
                return $http.get(url + 'queryAllHashTag');
            },

            //查询所有官方创建话题
            queryGuideHashTag:function(){
                return $http.get(url + 'queryGuideHashTag');
            },

            //获取关注人员的分享
            queryFollowColleagueCircle:function(pageSize,timeStamp){
                return $http.get(url + 'queryFollowColleagueCircle', {
                    params: {
                        pageSize: pageSize,
                        timeStamp: timeStamp
                    }
                });
            },

            //根据话题ID获取同事圈内容
            queryColleagueCircleByHashTag:function(pageSize,timeStamp, tagName){
                return $http.get(url + 'queryColleagueCircleByHashTag', {
                    params: {
                        pageSize: pageSize,
                        timeStamp: timeStamp,
                        tagName: tagName
                    }
                });
            },

            //获取空间同事圈
            querySpaceShare:function(spaceId,pageSize,timeStamp){
                return $http.get(url + 'querySpaceShare', {
                    params: {
                        spaceId: spaceId,
                        pageSize: pageSize,
                        timeStamp: timeStamp
                    }
                });
            },

            // 话题搜索
            queryShareLikeHashTagName: function(pageSize, timeStamp, tagName) {
                return $http.get(url + 'queryShareLikeHashTagName', {
                    params: {
                        pageSize: pageSize,
                        timeStamp: timeStamp,
                        tagName: tagName
                    }
                });
            },

            //获取@我，评论，两大块通知
            // type:1为@我，2为评论，3为会审提醒
            getTopicNoticeItems:function(pageNo,pageSize,type){
                return $http.get(base.restfulUrl + "user/" + 'getTopicNoticeItems', {
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        type: type
                    }
                });
            },

            //搜索所有朋友圈正文
            queryShareLikeKeyWord:function(pageSize,timeStamp,keyWord){
                return $http.get(url + 'queryShareLikeKeyWord', {
                    params: {
                        timeStamp: timeStamp,
                        pageSize: pageSize,
                        keyWord: keyWord
                    }
                });
            },

            getAttachs: function(attachId) {
                return $http.get(base.restfulUrl + "fileUploadController/" + 'getAttachs', {
                    params: {
                        fileId: attachId
                    }
                });
            },

            //设置@me消息为已读
            setTopicNoticeItemRead:function(noteId){
                return $http.get(base.restfulUrl + "user/" + 'setTopicNoticeItemRead', {
                    params: {
                        noteId: noteId
                    }
                });
            },

            //清除所有未读@me消息
            clearAllTopicNoticeItem:function(){
                return $http.get(base.restfulUrl + "user/" + 'clearNoReadShareAtMeNoitce');
            },

            //获取同事圈@我未读数
            countNoReadShareAtMe:function(){
                return $http.get(base.restfulUrl + "user/" + 'countNoReadShareAtMe');
            },

            setFlag:function(topicId){
                return $http.get(url + "setColleagueCircleDone", {
                    params: {
                        shareId : topicId
                    }
                });
            },

            getAdminIds: function(){
                return $http.get(base.users);
            }
        };
    }

    resource.$inject = deps;
    app.lazy.factory('ColleagueResource', resource);
});
