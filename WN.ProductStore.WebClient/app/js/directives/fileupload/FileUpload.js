define(['app', "jquery", "resources/FileuploadResource"], function (app, $) {
	
	var deps = ["FileuploadResource"];
	
	function fileUploadFun(FileuploadResource){
		return {
			replace : true,
			templateUrl : "views/common/fileupload/FileUpload.html",
			scope : {
				text : "@",                        //添加附件
				isItem : "=item",                  //false
				idConfig : "=idConfig",            //idConfig
				shareItem : "=shareItem",
                editor : "=editor",
                isShowBtn : "=?"
			},
			link : function($scope, element, attrs){
                //富文本环境下隐藏添加附件按钮
                if($scope.editor){
                    $scope.buttonDisplay = "none";
                }
				if ($scope.text) {
					$scope.showText = $scope.text;
				}
				$scope.$watch(attrs.item, function(){
					if ($scope.isItem) {
						$scope.inMenu = $scope.isItem;
					}
				});
				$scope.$watch(attrs.idConfig, function(){
					//liuwenjun 重构了一下以适应分享图片时没有id的情况。
					if ($scope.idConfig != null || $scope.shareItem || $scope.editor ) {
						var idType = "", id = "";
						var url = "restful/fileUploadController";
						var regex = "", dataType = "";
						if (!$scope.shareItem && !$scope.editor)
						{
							idType = $scope.idConfig["idType"];
							id = $scope.idConfig["id"];
							dataType = "text";
							url += "/fileUpload?prop="+ idType +"&objId=" + id;
							if (idType == "userId")
							{
								regex = /(\.|\/)(gif|jpe?g|png|bmp)$/i;
							}
						}
						else
						{
							dataType = "json";
							url += "/fileUploadReturn";
							if ($scope.shareItem == 3) {
								regex = /(\.|\/)(gif|jpe?g|png|bmp)$/i;
							} else if($scope.shareItem == 4) {
								regex = /(\.|\/)(ogg|mp4|avi|3gp)$/i;
							} else if($scope.shareItem == 5) {
								regex = /(\.|\/)(ogg|mp3|aac)$/i;
							}
						}

						$scope.options = {
		 				    url : url,
		 				    dataType: dataType,
		 				    acceptFileTypes: regex,
						    autoUpload: true,
                            pasteZone: null
						};

						if ($scope.shareItem && $scope.shareItem == 5) {
							$scope.options.maxNumberOfFiles = 1;
						}

						$scope.$on("fileuploaddone", function($event, data) {
			                $event.targetScope.clear($event.targetScope.queue);
			                if (data.result) {
			                	if (idType == "taskId") {
				                	// 查询任务信息
				        			FileuploadResource.queryTaskAttachs(id).success(function(data) {
					        			$scope.$emit("event.upload.done", data);
				        			});
			                	}
			                	if (idType == "userId") {
			                		// 获取用户头像图片链接
			                		var userImageUrl = "restful/userimage/" + id + "?t=" + new Date().getTime();
			                		$scope.$emit("event.upload.done", userImageUrl);
			                	}
			                	if ($scope.shareItem)
			                	{
			                		$scope.$emit("event.upload.done", data.result);
			                	}
                                if ($scope.editor){
                                    $scope.$emit("event.upload.done", data.result);
                                }
			                }
						});
					}
				});
			}
		};
	}

	fileUploadFun.$inject = deps;

    app.lazy.directive('fcFileUpload', fileUploadFun);
});
