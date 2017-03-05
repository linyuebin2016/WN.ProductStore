/**
 * 人员搜索和选择的模块.
 * 用法：
 * 在input标签加入fc-user-search的属性，如：<input fc-user-search>.
 * 单选模式：<input fc-user-search single="true">
 * 自动获焦：<input fc-user-search autofocus>
 */
define(["app", "services/SpaceService", "resources/UserResource", "resources/SpaceResource","services/UserPanelService","services/BaseService"], function(app){
	var deps = ["UserResource", "SpaceService", "SpaceResource","$timeout","UserPanelService","BaseService"];
	
	function directive(UserResource, SpaceService, SpaceResource,$timeout,UserPanelService,BaseService) {
		var args = arguments;
      
		return {
			restrict : "A",
			templateUrl : "views/user/Search.html",
			replace : true,
			scope : {
				chosenList : "=ngModel",
				onSelect : "&onSelect",
				onRemove : "&onRemove",
                tag : "@",
                noneOrg : "@?",
                contextId : "@?"
			},
			link : function($scope, element, attrs) {//, ngModel,BaseService){
                $scope.baseUrl = BaseService.restfulUrl;
				linking($scope, $(element), attrs, args);
			}
		};
	}
	
	function linking($scope, element, attrs, services) {
		var UserResource = services[0];
        var SpaceService = services[1];
        var SpaceResource = services[2];
        var $timeout = services[3];
        var UserPanelService = services[4];
        $scope.pageNo = 1;
        var pageSize = 8;

        if($scope.noneOrg && $scope.noneOrg=='true'){
            $scope.noneOrgUserSearch = true;
        }


		init();
		$scope.setActiveUser = function(user) {
			$scope.active = user;
		};
		
		$scope.isActive = function(user) {
			return $scope.active && $scope.active.userId == user.userId;
		};
		
		$scope.isChosenActive = function(user) {
			return $scope.chosenActive && $scope.chosenActive.userId == user.userId;
		} ;
		
		$scope.toggleUser = function(user,event){
            if(event)event.stopPropagation();

			// if($scope.isChosen(user)) {
			// 	$scope.removeUser(user);
			// } else {

			if(!user){
				return;
			}
			for(var i = 0; i < $scope.userList.length; i++){
				if($scope.userList[i].userId == user.userId){
					$scope.userList.splice(i, 1);
				}
			}
			$scope.addUser(user);
			esc();
			// }
			
			/**var input = element.find("input");
            input.focus(); **/
		};

		$scope.addUser = function(user){
			if($scope.onSelect) {
				var r = $scope.onSelect({$user:user});
				if(r === false) {
					return false;
				}
			}
			
			if($scope.options.single) {
				addSingleUser(user);
			} else {
				addMutipleUser(user);
			}
			$scope.setActiveUser($scope.userList[0]);
		};
		
		$scope.removeUser = function(user){
			if($scope.onRemove) {
				var r = $scope.onRemove({$user:user});
				if(r === false) {
					return false;
				}
			}
			
			for(var i=0; i<$scope.chosenList.length; i++) {
				if(user.userId == $scope.chosenList[i].userId) {
					$scope.chosenList.splice(i, 1);
					break;
				}
			}
			
			$scope.chosenActive = null;
		};
		
		$scope.isChosen = function(user) {
			for(var i=0; i<$scope.chosenList.length; i++) {
				if(user.userId == $scope.chosenList[i].userId) {
					return true;
				}
			} 
			
			return false;
		};
		
		$scope.closePanel = function() {
			$scope.userName = "";
			closePanelAndEmit();
		};

        function closePanelAndEmit(){
            $scope.isShowPanel = false;
            if($scope.tag == "board"){
                $timeout(function(){
                    $scope.$emit("event.board.closeUserPanel",element);
                },0);
            }
            if($scope.tag == "board.pop"){
                $timeout(function(){
                    var arg = [];
                    arg[0] = element;
                    UserPanelService.doit("event.board.pop.closeUserPanel",arg);
                },0);
            }
        }

		function init() {
			$scope.options = {
	           minHeight : 20,
	           maxWidth : 200,
		       single : false,
		       autofocus : false,
		       screen : true
			};
			
			parseOptions();
			
			if(!$scope.chosenList) {
				$scope.chosenList = [];
			}
			
			renderElement();
		}
		
		function addSingleUser(user) {
			$scope.chosenList = [];
			$scope.chosenList.push(user);
			$scope.chosenActive = null;

			$scope.closePanel();
		};
		
		function addMutipleUser(user) {
			if(!$scope.isChosen(user)) {
				$scope.chosenList.push(user);
				$scope.chosenActive = null;
				$scope.userName = "";
			}
		};
		
		$scope.highlight = function(text) {			
			if($scope.userName || $scope.userName == ''){
				return text;
			}
			if(!text) {
				return text;
			}
	        return text.replace(new RegExp($scope.userName, 'gi'), '<span class="text-match">$&</span>');
		};

        $scope.load = $scope.load || {};
        $scope.userList = [];
		function search() {
            $scope.noUserTip = "努力搜索中...";

            $scope.load.loading = true;
            $scope.load.lastPage = false;

			$scope.chosenActive = null;

            $scope.userName = $scope.userName || "";

            //判断如果是选择被催办人，则采用对应的接口在任务的执行人当中返回搜索结果
            //其他则默认搜索全部分
            if($scope.tag && $scope.tag == "urgeUser" && $scope.contextId){
                pageSize = 100000;  //全部返回
                UserResource.searchTaskUrgeUser({
                    userNameKey:$scope.userName,
                    taskId : $scope.contextId
                },function(data){
                    handleUserData(data);
                });
            }else{
                UserResource.searchUserByUserName({
                    userName : $scope.userName,
                    pageNo : $scope.pageNo,
                    pageSize : pageSize
                }, function(data){
                    handleUserData(data);
                });
            }
		}

        //处理返回的人员数据
        function handleUserData(data){
            openUserPanel();
            $scope.setActiveUser(data[0]);
            if($scope.pageNo==1){
                $scope.userList = [];
            }
            for(var i=0;i<data.length;i++){
                if(!isExist(data[i].userId) && !data[i].stop && !$scope.isChosen(data[i])){
                    $scope.userList.push(data[i]);
                }
            }
            $scope.load.loading = false;
            if (data && data.length < pageSize) {
                $scope.load.lastPage = true;
            }
            if($scope.userList.length>0){
                $scope.noUserTip = "搜索结果";
            }else{
                $scope.noUserTip = "找不到相应的人员";
            }
        }

        //判断要增加的人员是否已存在
        function isExist(userId){
            for(var i=0;i<$scope.userList.length;i++){
                if($scope.userList[i].userId == userId){
                    return true;
                }
            }
            return false;
        }

        function openUserPanel(){
            $scope.isShowPanel = true;
            if($scope.tag == "board"){
                $timeout(function(){
                    $scope.$emit("event.board.openUserPanel",element);
                }, 0);
            }
            if($scope.tag == "board.pop"){
                $timeout(function(){
                    var arg = [];
                    arg[0] = element;
                    UserPanelService.doit("event.board.pop.openUserPanel",arg);
                }, 0);
            }
        }

        $scope.scrollHandler = function () {
            if ($scope.load.lastPage) {
                return;
            }
            $scope.pageNo++;
            search();
        };

		function enter() {
			if($scope.active) {
				$timeout(function() {
					$scope.toggleUser($scope.active);
				}, 0);
			}
		}
		
		function backspace() {
			if($scope.userName) {
                $scope.pageNo = 1;
                $scope.userList = [];
				search();
				return false;
			}
			
			if($scope.chosenActive) {
				$scope.removeUser($scope.chosenActive);
			} else {
				$scope.chosenActive = $scope.chosenList[$scope.chosenList.length - 1];
			}

			$timeout(function() {
				closePanelAndEmit();
			}, 0);
		}
		
		function esc() {
			closePanel();
		}

        /** 上下键切换选择的人员 **/
        function up() {
            var index = $scope.userList.indexOf($scope.active);
            if(index == 0){
                $scope.active = $scope.userList[$scope.userList.length-1];
            }else{
                $scope.active = $scope.userList[index-1];
            }

            $timeout(function(){
                scrollToVisi();
            },10);
        }

        /** 上下键切换选择的人员 **/
        function down() {
            var index = $scope.userList.indexOf($scope.active);
            if(index == $scope.userList.length-1){
                $scope.active = $scope.userList[0];
            }else{
                $scope.active = $scope.userList[index+1];
            }

            $timeout(function(){
                scrollToVisi();
            },10);
        }

        /** 上下键切换时，通过滚动，确保选择的列表项能被看到 **/
        function scrollToVisi(){
            var $panel = element.find(".panel"),
                $activeLi = $panel.find("li.active"),
                $panelBody = $panel.find(".panel-body"),
                $ul = $panelBody.find("ul");
            /** 滚动距离**/
            var scrollH = $panelBody.scrollTop();
            /** 假设列表项高度最高不超过70 **/
            var maxLiH = 70;
            /** 当前最长可视列表项距离 ,那么可见范围是scrollH - maxVisi **/
            var maxVisi = scrollH + $panelBody.height() - maxLiH;
            /** 列表项相对于总列表的距离，这里要减去$panelHead的高度 **/
            var panelHeadH = 41;
            var far = $activeLi.get(0).offsetTop - panelHeadH;

            /** 如果该列表项不可视，则滚动 **/
            if( far<scrollH || far>maxVisi){

                /** 滚动 **/
                $timeout(function () {
                    $panelBody.animate({
                        scrollTop: far
                    }, 10);
                }, 10);
            }

        }

        function closePanel() {
			if ($scope.isShowPanel) {
				$timeout(function() {
					$scope.closePanel();
				}, 0);
			}
		}

		function renderElement() {
			var input = element.find("input");
            var panel = element.find(".panel");
            var parents = element.parents();

			element.css("height", "auto");
			element.css("line-height", "");
			input.attr("placeholder", attrs.placeholder);

			if($scope.options.autofocus) {
				input.focus();
			}

			input.keyup(keyHandle);

            panel.css("width", $scope.options.maxWidth);
            panel.css("minHeight", $scope.options.minHeight);

			/**element.click(function(event){
				event.stopPropagation();
				input.focus();
			});  **/

			parents.on("click", closePanel);

            element.on("blur", closePanel);

            input.on("focus click",function(event){
                event.stopPropagation();
                element.find(".panel-body").scrollTop(0,0);
                $scope.userList = [];
                $scope.pageNo = 1;
                search();
            });

            $scope.$on("$destroy", function userSearchDestroy() {
                parents.off("click", closePanel);
            });
		}

        var querying;
		function keyHandle(event) {
			switch(event.which)
			{
			case 8 :
				backspace();
				break;
			case 13 : 
				enter();
				break;
			case 27 :
				esc();
				break;
            case 38 :
                up();
                break;
            case 40 :
                down();
                break;
			default :
                $scope.pageNo = 1;
                $scope.userList = [];
                if(!querying){
                    querying= $timeout(function() {
                        search();
                        querying = null;
                    }, 400);
                }
			}
		}
		
		function parseOptions() {
			angular.extend($scope.options, {
				single : attrs.single === "true",
				autofocus : attrs.autofocus != undefined,
				screen : attrs.screen == undefined || attrs.screen === "true"  
			});
		}
	}
	
	directive.$inject = deps;
	app.lazy.directive("fcUserSearch", directive);
});