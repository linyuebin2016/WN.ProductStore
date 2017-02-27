define(["app",
    "directives/Loading",
    "directives/OpenRedpack",
    "services/WebsocketService",
    "services/BaseService",
    "services/MenuService",
    "services/UserService",
    "resources/UserResource"
], function (app) {

    "use strict";

    var deps = ["$scope", "$q", "$state", "$interval", "$rootScope", "MenuService", "UserResource", "WebsocketService", "BaseService", 'UserService'];
    var config;

    function controller($scope, $q, $state, $interval, $rootScope, MenuService, UserResource, WebsocketService, BaseService, UserService) {

        /* 公用属性 */

        $scope.baseUrl = BaseService.restfulUrl;
        // 是否运行在浏览器
        $scope.runInBrowser = runInBrowser();
        // 当前用户
        $scope.currentUser = UserService.getCurrentUser() || {};
        // 跳转
        $scope.goto = function (path) {
            path = 'home.' + path
            $state.go(path);
        }
        $scope.goback = function () {
            window.history.back();
        }
        // 判断当前路由
        $scope.stateIs = function (path) {
            return $state.is('home.' + path);
        }
        // 是否app主界面
        $scope.isAppMain = function () {
            switch ($state.current.name) {
                case"home.task":// 首页/任务
                case"home.communication":// 交流
                case"home.discover":// 发现
                case"home.myself":// 我
                    return true;
                    break;
                default:
                    return false;
                    break;
            }
        };

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
            switch ($state.current.name) {
                // 不响应后退
                case"home.login":// 登录
                case"home.task":// 首页/任务
                case"home.communication":// 交流
                case"home.discover":// 发现
                case"home.myself":// 我
                    break;
                default:
                    window.history.back();
                    break;
            }
        }

        $scope.$on("$destroy", function destroyHome() {
            $interval.cancel(websocketTimer);
            WebsocketService.destroy();
        });

        var websocketTimer = $interval(function () {
            WebsocketService.send('HBT1');
        }, 60 * 1000);

        // 红包
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
                // TODO:待完成后进行路由调整为app
                ContextType = MenuService.queryContextTypeByLocationURLforWX(toState, toParams);
                if (ContextType != null) {
                    showRedPack(ContextType);
                }
            }
        })

        function queryRedPack() {
            // TODO:待完成后进行路由调整为app
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
