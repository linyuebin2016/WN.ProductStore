define(["app"], function(app) {
	var deps = ["$http", "BaseService"];

	function resource($http, BaseService) {
		return initSpaceResource($http,BaseService.restfulUrl + "space/");
	}
	var postHeader = {
			"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
	};
	function initSpaceResource($http,spaceUrl){
		return {
            getUserSpaces : function() {
                return $http.get(spaceUrl + 'getMySpaces');
            },
			getSpace:function(){
				return $http.get(spaceUrl+'getSpace',{});
			},
			saveSpace:function(spaceVo){
				return $http.post(spaceUrl + "saveSpace", angular.toJson(spaceVo));
			},
            getPinyin:function(data){
                return $http.get(spaceUrl+"getPinyin",{
                    params: {
                        spaceName:data
                    }
                });

            },
            getSpaceById:function(spaceId){
                return $http.get(spaceUrl+"getSpaceById",{
                    params:{
                        spaceId: spaceId
                    }
                });
            },
            updateSpace:function(spaceVo){
                 return $http.post(spaceUrl+"updateSpace",angular.toJson(spaceVo));
            },
            resetPasswords:function(spaceIds,password){
                return $http.post(spaceUrl+"resetMasPassWord",{
                    spaceIds : spaceIds,
                    password : password
                },{
                    headers: postHeader
                });
            },
            getSpaceBySpaceName:function(spaceName){
                return $http.get(spaceUrl+"getSpaceBySpaceName",{
                    params:{
                        spaceName:spaceName
                    }
                });
            },
            isObserver : function(spaceId){
                return $http.post(spaceUrl + "isObserver", {
                    spaceId : spaceId
                }, {
                    headers: postHeader
                });
            },

            getSpaceStatist : function(spaceId) {
                return $http.get(spaceUrl + "getSpaceStatist", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },


            getTotalTaskSummary : function(spaceId, startDate, endDate) {
                return $http.get(spaceUrl + "getTotalTaskSummary", {
                    params : {
                        spaceId : spaceId,
                        startDate : startDate,
                        endDate : endDate
                    }
                });
            },

            getUserTaskSummary : function(spaceId, startDate, endDate, sortType) {
                return $http.get(spaceUrl + "getUserTaskSummary", {
                    params : {
                        spaceId : spaceId,
                        startDate : startDate,
                        endDate : endDate,
                        sortType : sortType
                    }
                });
            },

            getTopInfos : function(spaceId) {
                return $http.get(spaceUrl + "getTopInfos", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            getMyTodoTasks : function(spaceId, pageNo, pageSize) {
                return $http.get(spaceUrl + "getMyTodoTasks", {
                    params : {
                        pageNo : pageNo,
                        pageSize : pageSize,
                        spaceId : spaceId
                    }
                });
            },

            getHotDiscussions : function(spaceId, queryType) {
                return $http.get(spaceUrl + "getHotDiscussions", {
                    params : {
                        pageNo : 1,
                        pageSize : 10,
                        spaceId : spaceId,
                        queryType : queryType
                    }
                });
            },

            getNewDiscussions : function(spaceId, timeStamp, pageSize) {
                return $http.get(spaceUrl + "getNewDiscussions", {
                    params : {
                        timeStamp : timeStamp,
                        pageSize : pageSize,
                        spaceId : spaceId
                    }
                });
            },

            getHotShares : function(spaceId, queryType) {
                return $http.get(spaceUrl + "getHotShares", {
                    params : {
                        pageNo : 1,
                        pageSize : 10,
                        spaceId : spaceId,
                        queryType : queryType
                    }
                });
            },

            getNewShares : function(spaceId, timeStamp, pageSize) {
                return $http.get(spaceUrl + "getNewShares", {
                    params : {
                        timeStamp : timeStamp,
                        pageSize : pageSize,
                        spaceId : spaceId
                    }
                });
            },

            getNontopTasks : function(spaceId, timeStamp, pageSize) {
                return $http.get(spaceUrl + "getNontopTasks", {
                    params : {
                        pageSize : pageSize,
                        timeStamp : timeStamp,
                        spaceId : spaceId
                    }
                });
            },

            getNontopDiscussions : function(spaceId, timeStamp, pageSize) {
                return $http.get(spaceUrl + "getNontopDiscussions", {
                    params : {
                        timeStamp : timeStamp,
                        pageSize : pageSize,
                        spaceId : spaceId
                    }
                });
            },

            getNontopShares : function(spaceId, timeStamp, pageSize) {
                return $http.get(spaceUrl + "getNontopShares", {
                    params : {
                        timeStamp : timeStamp,
                        pageSize : pageSize,
                        spaceId : spaceId
                    }
                });
            },

            cancelAllTop : function(spaceId) {
                return $http.get(spaceUrl + "cancelAllTop", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            cancelInfoTop : function(infoId, type) {
                return $http.get(spaceUrl + "cancelInfoTop", {
                    params : {
                        infoId : infoId,
                        type : type
                    }
                });
            },

            setlInfoTop : function(infoId, type) {
                return $http.get(spaceUrl + "setlInfoTop", {
                    params : {
                        infoId : infoId,
                        type : type
                    }
                });
            },

            /**
             * 获取空间面板
             * @param spaceId 空间Id
             */
            getBoardSummary : function(params){
                return $http.get(spaceUrl + "getBoardSummary", {
                    params : params
                });
            },

            /**
             * 获取空间看板任务数据【经营计划定制】
             * @param spaceId 空间Id
             */
            getBoardTaskSum : function(spaceId){
                return $http.get(spaceUrl + "getBoardTotalTaskSum", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            /**
             * 看板名称修改、重命名
             * @param boardId
             * @param boardName
             */
            resetBoardName : function(boardId, boardName){
                return $http.post(spaceUrl + "resetBoardName", {
                    boardId : boardId,
                    boardName : boardName
                }, {
                    headers: postHeader
                });
            },

            saveBoardPermission: function(boardId, editors, readers,observers) {
                return $http.post(spaceUrl + "saveBoardPermission", {
                    boardId: boardId,
                    editors: editors,
                    readers: readers,
                    observers: observers
                }, {
                    headers: postHeader
                });
            },

            /**
             * 获取空间的未整理任务（type参数如果是"five"，表示只返回前面5条用于空间任务首页的看板显示，不传或者其他，则返回全部）
             * @param spaceId 空间Id
             * @param type
             */
            getOtherTasks : function(spaceId, type){
                return $http.post(spaceUrl + "getOtherTasks", {
                    spaceId : spaceId,
                    type : type
                }, {
                    headers: postHeader
                });
            },

            /**
             * 新增看板,返回看板VO
             * @param boardName 看板名称
             * @param spaceId 空间Id
             */
            addBoard : function(boardName, spaceId){
                return $http.post(spaceUrl + "addBoard", {
                    boardName : boardName,
                    spaceId : spaceId
                }, {
                    headers: postHeader
                });
            },

            /**
             * 删除任务板
             * @param boardId 任务板ID
             */
            removeBoard : function( boardId ){
                return $http.post(spaceUrl + "removeBoard", {
                    boardId : boardId
                }, {
                    headers: postHeader
                });
            },

            /**
             * 获取空间全部进行中的任务
             * @param spaceId 空间Id
             */
            getSpaceUnfiniTasks : function(spaceId){
                return $http.get(spaceUrl + "getSpaceUnfiniTasks", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            /**
             * 获取空间全部暂停的任务
             * @param spaceId 空间Id
             */
            getSpacePauseTasks : function(spaceId){
                return $http.get(spaceUrl + "getSpacePauseTasks", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            /**
             * 获取空间全部取消的任务
             * @param spaceId 空间Id
             */
            getSpaceCancelTasks : function(spaceId){
                return $http.get(spaceUrl + "getSpaceCancelTaskList", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            /**
             * 获取空间全部今天完成的任务
             * @param spaceId 空间Id
             */
            getSpaceTodFiniTasks : function(spaceId){
                return $http.get(spaceUrl + "getSpaceTodFiniTasks", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            /**
             * 获取空间的全部已完成任务，用于全部已完成任务的显示
             * @param spaceId 空间Id
             */
            getSpaceFinishTasks : function(spaceId){
                return $http.get(spaceUrl + "getSpaceFinishTasks", {
                    params : {
                        spaceId : spaceId
                    }
                });
            },

            searchUserbyNameInSpace : function(spaceId,userNameKey,pageNo,pageSize){
                return $http.get(spaceUrl + "querySpaceUsers",{
                    params : {
                        spaceId : spaceId,
                        userNameKey :  userNameKey,
                        pageNo : pageNo,
                        pageSize : pageSize
                    }
                });
            },

            queryRecentLinkUsers : function(pageNo,pageSize){
                return $http.get(spaceUrl + "queryRecentLinkUsers",{
                    params : {
                        pageNo : pageNo,
                        pageSize : pageSize
                    }
                });
            },

            isCurrentUserSpaceManager : function(spaceId){
                return $http.get(spaceUrl + "isCurrentUserSpaceManager",{
                    params : {
                        spaceId : spaceId
                    }
                });
            },
			
            isCurrentBoardManager : function(boardId){
                return $http.get(spaceUrl + "isCurrentBoardManager",{
                    params : {
                        boardId : boardId
                    }
                });
            },
		};
	}
	resource.$inject = deps;
	app.lazy.factory("SpaceResource", resource);
});
