define(["app",
    'jquery',
    'angular',
    'services/TipsService',
    'services/UserService',
    'services/ConferenceService',
    'services/BusinessCardService',
    'services/NativeService',
    'services/MenuItemService',
    'services/RedPackageService',
    'resources/ColleagueResource',
    "filters/CodeNameFilter",
    "resources/TypeDefResource",
    "resources/UserSettingResource",
    'directives/BindHtml',
    "resources/ChatResource",
    "resources/ContactsResource"
], function(app, $, angular) {

    var deps = ["$timeout", "$state", "$rootScope", "$modal", "TipsService", "BaseService", "ChatResource", "ContactsResource", "RedPackageService",
        "UserService", "ColleagueResource", "BusinessCardService", "ConferenceService", 'NativeService', 'MenuItemService',"TypeDefResource","UserSettingResource"
    ];

    function directive($timeout, $state, $rootScope, $modal, TipsService, BaseService, ChatResource, ContactsResource, RedPackageService, UserService,
        ColleagueResource, BusinessCardService, ConferenceService, NativeService, MenuItemService,TypeDefResource,UserSettingResource) {
        return {
            templateUrl: 'views/common/userpanel/UserPanel.html',
            replace: false,
            scope: {
                chat: '=fcUserPanel',
                ngIf: '=?',
            },
            link: function($scope, element, attrs) {
                var userpanelfadeOut = function() {
                    $("#mydiv1").fadeOut();
                    setTimeout(function() {
                        $scope.ngIf = false;
                        $scope.$apply();
                    }, 500);
                }

                $scope.BusinessSkillList=[];
                $scope.loginUser = UserService.getCurrentUser();

                ContactsResource.getUserByUserId($scope.chat.userId || $scope.chat.cardId ||$scope.chat).success(function(user) {
                    $scope.user = user;
                    $scope.isSelf = $scope.loginUser.userId == user.userId;
                    // 业务专长
                    UserSettingResource.queryUserCard($scope.chat.userId || $scope.chat.cardId ||$scope.chat).success(function (data) {
                        $scope.BusinessSkillList = data.userSpecialties;
                        // 1022 专业分类
                        TypeDefResource.getListByTypeCode(1022).success(function (list) {
                            $scope.type1022 = list;
                        });
                    });
                    $scope.baseUrl = BaseService.restfulUrl;
                    //显示详细信息框
                    $("#mydiv1").fadeIn();
                    $("#mydiv1").click(function() {
                        event.stopPropagation();
                    });
                    $(".contents").click(function() {
                        userpanelfadeOut();
                    });
                    event.stopPropagation();
                    $scope.user.showOrg = [];
                    if (user.userOrg) {
                        for (var i = 0; i < user.userOrg.length; i++) {
                            $scope.user.showOrg.push({
                                orgnames: user.userOrg[i].orgName.split(' / '),
                                postname: user.userOrg[i].postName || "",
                                orgid: user.userOrg[i].orgId
                            });
                        }
                    }
                });

                //消息窗口中发起会话跳转接口
                $scope.selectSearch = function selectSearch(item) {
                    var id = {
                        userId: item.userId
                    };
                    ChatResource.query(id, null, 1).then(function(topic) {
                        $scope.$emit("event.change.menu", "/chat");
                        $state.go('home.chat.msg', {
                            id: topic.topicId,
                            readMore: true
                        });
                    });
                    userpanelfadeOut();
                };

                $scope.viewUserColleague = function() {
                    $scope.$emit("event.change.menu", "/colleague");
                    if ($('.colleageue').length == 0) {
                        $state.go('home.colleague', {
                            viewUserId: 'person_' + $scope.user.userId
                        });
                    }
                    $scope.$emit('event.Colleague.viewUserColleague', {
                        viewUserId: 'person_' + $scope.user.userId
                    });
                    userpanelfadeOut();
                };

                $scope.shareBusinessCard = function() {
                    userpanelfadeOut();
                    BusinessCardService.shareBusinessCard({
                        objectId: $scope.chat.userId
                    }, function(data) {
                        $scope.$bus.publish(data);
                    });
                };

                $scope.focusUser = function() {
                    $rootScope.forbidLoading = true;
                    ColleagueResource.focusUser($scope.user.userId, 0).success(function(data) {
                        $scope.user.isFocus = data;
                        setTimeout(function() {
                            $rootScope.forbidLoading = false;
                        }, 300);
                    })
                };

                $scope.jumpUserAddress = function(orgId, orgName) {
                    if ($state.current.templateUrl && $state.current.templateUrl.indexOf('UserList.html') > -1) {
                        $scope.$emit('event.Colleague.viewUserAddress', {
                            orgId: orgId,
                            orgName: orgName
                        });
                    } else {
                        $state.go('home.address.userList', {
                            orgId: orgId,
                            orgName: orgName
                        });
                        $scope.$emit("event.change.menu", "/address");
                    }
                    userpanelfadeOut();
                };

                $scope.showCopyMenu = function(event, text) {
                    var menu = MenuItemService.getMenu();
                    menu.append(MenuItemService.copyMenuItem(text));
                    menu.popup(event.originalEvent.x, event.originalEvent.y);
                    event.stopPropagation();
                };

                $scope.$on('$destory', function() {
                    $(".contents").off('click');
                    $("#mydiv1").off('click');
                });

                // 向上 个人红包入口
                $scope.snedPersonRedpack = function(){
                    if ($scope.user && $scope.user.userId) {
                        var userIds = [];
                        userIds.push($scope.user.userId);
                        RedPackageService.sendRedPack(userIds);
                    }
                }
            }
        };
    }

    directive.$inject = deps;
    app.lazy.directive("fcUserPanel", directive);
});
