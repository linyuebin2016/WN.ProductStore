define(["app",
    "directives/Loading",
    "directives/OpenRedpack",
    "services/WebsocketService",
    "services/BaseService",
    "services/MenuService",
    "services/SessionStorageService",
    "services/LocalStorageService",
    "services/WebAppService",
    "resources/UserResource"
], function (app) {

    "use strict";

    var deps = ["$scope", "$q", "$state", "$interval", "$rootScope", "$timeout", "MenuService", "UserResource", "WebsocketService", "BaseService", 'SessionStorageService', 'LocalStorageService', 'WebAppService'];
    var config;

    function controller($scope, $q, $state, $interval, $rootScope, $timeout, MenuService, UserResource, WebsocketService, BaseService, SessionStorageService, LocalStorageService, WebAppService) {

        $scope.baseUrl = BaseService.restfulUrl;
        $scope.runInBrowser = runInBrowser();
        $scope.currentUser;

        var href = window.location.href;
        var code = href.replace(/^.*?code=([\w]*?)&.*?$/, "$1");

        // android响应实体后退键
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            // 返回键
            document.addEventListener("backbutton", eventBackButton, false);
            // 菜单键
            // document.addEventListener("menubutton",eventMenuButton,false);
            // 搜索键
            // document.addEventListener("searchbutton",eventSearchButton,false);
        }

        function eventBackButton() {
            if ($rootScope.setBackButton) {
                window.history.back();
            }
        }

        $scope.goBack = function () {
            window.history.back();
        }

        // 应用入口必须调用【微信登陆】
        $scope.codeLogin = function () {
            var defer = $q.defer();
            var temp = SessionStorageService.getItem("user");
            if (temp != null) {
                $scope.currentUser = temp;
                WebsocketService.open();
                LocalStorageService.setItem("user", temp);
                defer.resolve(temp);
            } else {
                console.log(code);

                // 区别app/微信登录

                if (WebAppService.isWebApp()) {
                    // app登录
                    $state.go("home.login");
                }
                else {
                    // wx登录
                    UserResource.codeLogin({
                        "code": code,
                        "loginType": 1
                    }, function (user) {
                        if (user.authenticated) {
                            WebsocketService.open();
                            $scope.currentUser = user;
                            SessionStorageService.setItem("user", user);
                            LocalStorageService.setItem("user", user);
                            queryRedPack();// 查询红包，登陆的时候查一次，返回的时候不用，否则会调用两次
                            defer.resolve(user);
                        }
                        else {
                            alert("登录失败");
                        }
                    }, function () {
                        alert("登录失败");
                    });
                }
            }
            return defer.promise;
        }

        $scope.goto = function (path) {
            path = 'home.' + path
            $state.go(path);
        }

        $scope.$on("$destroy", function destroyHome() {
            $interval.cancel(websocketTimer);
            WebsocketService.destroy();
        });

        var websocketTimer = $interval(function () {
            WebsocketService.send('HBT1');
        }, 60 * 1000);

        function showRedPack(ContextType) {
            if ($scope.currentUser && $scope.currentUser.userOrg && $scope.currentUser.userOrg.length > 0) {
                ContextType += (ContextType.length == 0 ? "" : ",") + $scope.currentUser.userOrg[0].orgId
            }

            UserResource.queryUserToReceiveRedPack({
                contextTypeValue: ContextType
            }, function (data) {
                if (data && data.length > 0) {
                    $scope.$bus.publish({
                        channel: 'receive.redpack',
                        topic: 'RedPack',
                        data: data
                    });
                }
            })
        }

        $scope.$on("receiveRedPack.HomeController", function (event, data) {
            showRedPack(data);
        })

        var ContextType;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState) {
                ContextType = MenuService.queryContextTypeByLocationURLforWX(toState, toParams);
                if (ContextType != null) {
                    showRedPack(ContextType);
                }
            }
        })

        function queryRedPack() {
            ContextType = MenuService.queryContextTypeByLocationURLforWX({
                templateUrl: window.location.hash
            });
            if (ContextType != null) {
                showRedPack(ContextType);
            }
        }
    }

    controller.$inject = deps;
    app.lazy.controller("HomeController", controller);
});
