define(["app", "angular", "services/BaseService"], function (app, angular) {

	var deps = ["$http", "BaseService"];

	function fileuploadResource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "fileUploadController/", BaseService.formHeader);
    }

    function initResource($http, fileuploadUrl, headers) {
        return {
        	/**
		     * 获取附件列表
		     * @param taskId 任务Id
		     */
			queryTaskAttachs : function(taskId){
				return $http.get(fileuploadUrl + "getTaskAttachs", {
					params: {
                        taskId: taskId
                    }
                });
			},

			/**
			 * 微信端文件上传通用接口
			 */
			uploadUserPicByWechat : function(serviceId) {
				return $http.get(fileuploadUrl+ "uploadUserPicByWechat",{
					params: {
						serviceId : serviceId
					}
				});
			},
			/**
			 * 删除附件
			 * @param prop 附件关联ID类型名称
			 * @param objId ID值
			 * @param fileIds 文件ID集
			 */
			delAttachs : function(prop, objId, fileIds){
				return $http.post(fileuploadUrl + "delAttachs", {
                    prop: prop,
                    objId : objId,
                    fileIds : angular.isArray(fileIds) ? fileIds : [ fileIds ]
                }, {
                    headers: headers
                });
			},

			/**
			 * 删除附件
			 * @param fileId 文件ID集
			 */
            removeFile : function(fileId){
				return $http.post(fileuploadUrl + "removeAttachs", {
                    fileId: fileId
                }, {
                    headers: headers
                });
			}
        };
    }

    fileuploadResource.$inject = deps;
    return app.lazy.service("FileuploadResource", fileuploadResource);
});
