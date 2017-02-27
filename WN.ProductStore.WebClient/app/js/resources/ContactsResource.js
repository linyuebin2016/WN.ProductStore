define(["app", "angular", "services/BaseService", "services/common/CacheService"], function(app, angular) {

	var deps = ["$http", "BaseService", 'CacheService'];

	function contactsResource($http, BaseService, CacheService) {
		return initResource($http, BaseService.restfulUrl + "contactsController/", BaseService, CacheService);
	}

	var postHeader = {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	};

	function initResource($http, contactsUrl, BaseService, CacheService) {
		return {
			/**
			 * 获取最近会话列表
			 * @param pageNo
			 * @param pageSize
			 */
			queryConverContacts: function(pageNo, pageSize) {
				return $http.get(contactsUrl + "queryConverContacts", {
					params: {
						pageNo: pageNo || 1,
						pageSize: pageSize || 10
					}
				});
			},

			/**
			 * 查询相关联系人
			 * @param prop
			 * @param value
			 */
			queryPropUsers: function(prop, value) {
				return $http.get(contactsUrl + "queryPropUsers", {
					params: {
						prop: prop || "",
						value: value || ""
					}
				});
			},

			/**
			 * 上传附件
			 */
			uploadCropImage: function(formData, cropParam) {
				return $http.post("restful/fileUploadController/saveGroupPic?" + $.param(cropParam), formData, {
					transformRequest: angular.identity,
					headers: {
						"Content-Type": undefined
					},
					transformResponse: function(data) {
						return {
							fileId: data
						};
					}
				});
			},

			/**
			 * 获取群组列表（带分页）
			 */
			queryGroupList: function(pageNo, pageSize) {
				return $http.get(contactsUrl + "queryGroupList");
			},

			/**
			 *获取收藏群组
			 */
			queryFavoriteGroupList: function(pageNo, pageSize) {
				return $http.get(contactsUrl + "queryMyCollectionFavoriteConver", {
					params: {
						pageNo: pageNo || 0,
						pageSize: pageSize || 0
					}
				});
			},

			setFavoriteConver: function(topicId, setFlag) {
				return $http.get(contactsUrl + "setMyCollectionFavoriteConver", {
					params: {
						topicId: topicId,
						operationType: setFlag
					}
				});
			},

			/**
			 * 获取群组列表（带分页）
			 */
			queryGroupByPage: function(pageNo, pageSize) {
				return $http.get(contactsUrl + "queryGroupByPage", {
					params: {
						pageNo: pageNo || 1,
						pageSize: pageSize || 10
					}
				});
			},

			/**
			 * 新建群组
			 */
			saveOrUpdateGroup: function(group) {
				return $http.post(contactsUrl + "saveOrUpdateGroup", angular.toJson(group));
			},

			/**
			 * 删除群组
			 */
			delGroup: function(groupIds) {
				return $http.post(contactsUrl + "delGroup", {
					groupIds: angular.isArray(groupIds) ? groupIds : [groupIds]
				}, {
					headers: postHeader
				});
			},

			/**
			 * 查询群组详情
			 */
			queryGroupById: function(groupId) {
				return $http.get(contactsUrl + "queryGroupById", {
					params: {
						groupId: groupId,
						flag: 1,
					}
				});
			},


			/**
			 * 新增群组成员
			 */
			addGroupUser: function(groupId, addUserIds) {
				return $http.post(contactsUrl + "updateGroupUser", {
					groupId: groupId,
					addUserIds: angular.isArray(addUserIds) ? addUserIds : [addUserIds]
				}, {
					headers: postHeader
				});
			},

			/**
			 * 删除群组成员
			 */
			delGroupUser: function(groupId, removeUserIds) {
				return $http.post(contactsUrl + "updateGroupUser", {
					groupId: groupId,
					removeUserIds: angular.isArray(removeUserIds) ? removeUserIds : [removeUserIds]
				}, {
					headers: postHeader
				});
			},

			/**
			 * 根据用户id获取用户信息
			 */
			getUserByUserId: function(userId) {
				return $http.post(BaseService.restfulUrl + "user/getUserByUserId", {
					userId: userId,
					operationDate: new Date().getTime()
				}, {
					headers: postHeader
				})
			},

			/**
			 * 根据用户id获取用户信息
			 */
			removeConverContact: function(topicId) {
				return $http.get(contactsUrl + "removeConverContact", {
					params: {
						topicId: topicId
					}
				});
			},

			/**
			 * 保存用户设置，是否提醒
			 */
			saveUserSetting: function(userSettingVo) {
				return $http({
					method: "POST",
					url: BaseService.restfulUrl + "userSetting/save",
					data: JSON.stringify(userSettingVo),
					headers: {
						'Accept': 'application/json',
						'Content-type': 'application/json'
					}
				});
			},

			/**
			 * 读取用户设置，是否提醒
			 */
			getOneUserSetting: function(appId, topicId) {
				return $http.get(BaseService.restfulUrl + "userSetting/getOne", {
					params: {
						appId: appId,
						topicId: topicId
					}
				});
			},

			/////////新加/////////////
			/**
			 * 获取最近会话列表
			 * @param pageNo
			 * @param pageSize
			 */
			queryConverContacts: function(pageNo, pageSize) {
				return $http.get(contactsUrl + "queryConverContacts", {
					params: {
						pageNo: pageNo || 1,
						pageSize: pageSize || 10
					}
				});
			},

			/**
			 * 查询相关联系人
			 * @param prop
			 * @param value
			 */
			queryPropUsers: function(prop, value) {
				return $http.get(contactsUrl + "queryPropUsers", {
					params: {
						prop: prop || "",
						value: value || ""
					}
				});
			},

			/**
			 * 获取群组列表
			 * @param groupName
			 */
			queryGroupList: function(groupName) {
				return $http.get(contactsUrl + "queryGroupList", {
					params: {
						groupName: groupName || ""
					}
				});
			},

			/**
			 * 新建群组
			 */
			saveOrUpdateGroup: function(group) {
				return $http.post(contactsUrl + "saveOrUpdateGroup", angular.toJson(group));
			},

			/**
			 * 根据组织、群组、岗位或者空间查询相应的人员信息
			 * @param objKey
			 * @param objId
			 */
			queryAboutContacts: function(objKey, objId) {
				return $http.get(contactsUrl + "queryAboutContacts", {
					params: {
						objKey: objKey || "",
						objId: objId || ""
					}
				});
			},

			/**
			 * 查询默认组织相关联系人
			 */
			queryOrgContacts: function() {
				return $http.get(contactsUrl + "queryOrgContacts");
			},

			/**
			 * 根据条件查询相应的组织、群组、岗位或者空间信息
			 * @param searchValue
			 */
			queryCommuContacts: function(searchValue, pageNo, pageSize) {
				return $http.get(contactsUrl + "queryCommuContacts", {
					params: {
						searchValue: searchValue || "",
						pageNo: pageNo || 1,
						pageSize: pageSize || 10
					}
				});
			},

			/**
			 * 根据条件查询相应的人员信息
			 * @param searchValue
			 */
			queryUserContacts: function(searchValue, pageNo, pageSize) {
				return $http.get(contactsUrl + "queryUserContacts", {
					params: {
						searchValue: searchValue || "",
						pageNo: pageNo || 1,
						pageSize: pageSize || 10
					}
				});
			},

			/**
			 * 根据条件查询相应的人员信息
			 * @param searchValue
			 */
			queryGroupContacts: function(searchValue, pageNo, pageSize) {
				return $http.get(contactsUrl + "queryGroupContacts", {
					params: {
						searchValue: searchValue || "",
						pageNo: pageNo || 1,
						pageSize: pageSize || 10
					}
				});
			},

			/**
			 * 根据条件查询相应的人员信息
			 * @param searchValue
			 */
			queryOrgSearchContacts: function(searchValue, pageNo, pageSize) {
				return $http.get(contactsUrl + "queryOrgSearchContacts", {
					params: {
						searchValue: searchValue || "",
						pageNo: pageNo || 1,
						pageSize: pageSize || 20
					}
				});
			},

			/**
			 * 根据条件查询相应的人员信息
			 * @param searchValue
			 */
			querySpaceContacts: function(searchValue, pageNo, pageSize) {
				return $http.get(contactsUrl + "querySpaceContacts", {
					params: {
						searchValue: searchValue || "",
						pageNo: pageNo || 1,
						pageSize: pageSize || 20
					}
				});
			}
		};
	}

	contactsResource.$inject = deps;
	return app.lazy.service("ContactsResource", contactsResource);
});
