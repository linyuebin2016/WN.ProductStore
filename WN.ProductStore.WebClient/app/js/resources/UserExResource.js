/**
 * Created by lifei on 14-2-21.
 */
define(["app"], function (app, BaseService) {

    var deps = ["$http", "BaseService"];

    function userExResource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "user/", BaseService.restfulUrl);
    }

    var reqHeader = {
        "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl, baseUrl) {
        return {
        	getAllusers: function () {        		
            	return $http.get(preUrl + "userList");
            },
            // 未使用
            getUsersByOrgId: function (orgId, pageNo, pageSize) {        		
            	return $http.get(preUrl + "userListByOrgId",{
                    params: {
                    	orgId: orgId,
                    	pageNo: pageNo,
                    	pageSize: pageSize
                    }
            	 });
            },
            
            //找组织下所有用户
            getUsersByOrg: function (orgId) {        		
            	return $http.get(preUrl + "userListAllByOrg",{
                    params: {
                    	orgId: orgId                       
                    }
            	 });
            },

            //找当前组织及其所有子孙组织下的所有用户
            getUsersByOrgAndChild: function (orgId, userName, pageNo, pageSize) {
                return $http.get(preUrl + "userListAllByOrgAndChild",{
                    params: {
                        orgId: orgId,
                        userName : userName,
                        pageNo:pageNo,
                        pageSize:pageSize
                    }
                });
            },
            
			// 服务：删除选中多个用户
            deleteUser: function (userIds) {				
				return $http.post(preUrl + "deleteUser",{                    
                    	userIds : userIds    
				},{
                    headers: reqHeader
                });
				
			},

            // 服务：停用或启用用户
            resetUserState: function (userIds,state) {
                return $http.post(preUrl + "resetUserState",{
                    userIds : userIds,
                    state : state
                },{
                    headers: reqHeader
                });

            },

            // 服务：保存新增用户
			saveUser: function (user) {
				return $http.post(preUrl + "saveUser", angular.toJson(user) );
			},
			// 服务：更新用户
			updateUser: function (user) {
				return $http.post(preUrl + "updateUser", angular.toJson(user));
			},
			// 服务：新增时检查是否已存在同名的loginname ,username
			checkUserForm: function (loginName,userName) {
				return $http.post(preUrl + "checkUserForm", {
					loginName : loginName,
					userName : userName
				}, {
                    headers: reqHeader
                });
			},
			// 服务：检查是否同名，查找对象：除当前修改的userid以外记录
			checkUserForUpdate: function (loginName,userName,userId) {
				return $http.post(preUrl + "checkUserForUpdate", {
					loginName : loginName,
					userName : userName,
					userId : userId
				}, {
                    headers: reqHeader
                });
			},
			// 服务：重置用户密码
            resetUserPassword: function (userIds) {
                return $http.post(preUrl + "resetUserPassword",{
                    userIds : userIds
                },{
                    headers: reqHeader
                });
            },
            monitorUserId: function (userId, clientFlag){
                return $http.get(baseUrl + "monitor/checkUserId", {
                    params: {
                        userId : userId,
                        clientFlag: clientFlag
                    },
                    transformResponse: function(resp) {
                    return {
                        result: resp
                    };
                }
                });
            },
            getUserByLoginName: function(loginName, userName){
                return $http.get(preUrl + "getUserByLoginName", {
                    params: {
                        loginName : loginName,
                        userName : userName
                    }
                });
            }
        }        
    }
    
    userExResource.$inject = deps;
    return app.lazy.service("UserExResource", userExResource);
});
