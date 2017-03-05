define(['app'
], function(app, _ ) {

	var deps = ["BaseService" ];

	function directive( BaseService) {
		return {
			templateUrl: 'views/user/UserCard.html',
			replace: true,
			scope: {
				member: '=fcUserCard',
			},
			link: function($scope) {
                $scope.baseUrl = BaseService.restfulUrl;
				/**
				 * 显示用户详情框
				 */
				$scope.showMessages = function(event, user) {
					//显示详细信息框
					var objDiv = $("#mydiv1"); 
					$(objDiv).css("display","block"); 
					if(event) {
						var target = $(event.currentTarget),
						position = target.position();
						if (user.userId) {
							if(position.top < 320){
								$(objDiv).css("top",  "20px"); 
							}else{
								$(objDiv).css("top", (position.top - 313) + "px"); 
							}
							$(objDiv).css("left", (position.left) + "px"); 
						} else {
							if (position.top < 60) {
								$(objDiv).css("top",  "20px"); 
							} else {
								$(objDiv).css("top", (position.top - 60) + "px"); 
							}
							$(objDiv).css("left", position.left + "px"); 
						} 
						// @解决卡片过高引起滚动条
						// 最小高度  = Math.ceil(卡片总数 / Math.floor(取窗口宽度 / 每个卡片及间隔宽度)) * (单张卡片及间隔高度)
		            	// 如果 最小高度 < 弹出窗口高度
//		            	var minH = (Math.ceil($scope.$parent.data.length / Math.floor($(window).width() / (277 + 16 + 32)))) * (88 +12);
//		            	if(minH < objDiv.height()){
//		            		$(".groupList").css("min-height", objDiv.height());
//		            	}
					}
					$("#org").hide();
					$("#post").show();				
//					$scope.$parent.changeUserOrg(false);
					$scope.$parent.setUser(user); //事件广播，将事件冒泡传递给父controller
					event.stopPropagation(); //停止事件冒泡
				};
				
			}
		};
	}

	directive.$inject = deps;
	return app.lazy.directive('fcUserCard', directive);
});