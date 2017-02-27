/**
 * Created by qiushaohua on 14-4-21.
 */
define(["app",
    "jquery",
    "angular",
    "websocket",
    "services/UserService",
    "services/NativeService"
], function (app, $, angular, websocket) {

    var FLAGS = "";

    if (runInBrowser()) {
        FLAGS = "Conversation, signSocialTaskUser";
    } else {
        FLAGS = "Conversation";
    }

    var deps = ['$rootScope', "UserService", "$state", "NativeService"];

    function service($rootScope, UserService, $state, NativeService) {

        var socket, // 这里改为一个Socket 处理所有的信息了
            loginUser,
            isInit = false;
        var pkg,
            localIp = UserService.getLocalIp(),
            deviceId = UserService.getDevice();

        window.runInBrowser(function () {
            pkg = require('../../../package.json');
        }, function () {
            pkg = {
                version: ""
            }
        });

        function onMessage(resp) {
            // 根据消息中的flag 来进行处理了.
            if (resp == null) return;

            var listenFlag = resp.listenFlag;

            $rootScope.$bus.publish({
                channel: 'websocket',
                topic: listenFlag,
                data: resp
            });
        }

        function onReconn() {
            $rootScope.$bus.publish({
                channel: 'websocket.event',
                topic: 'reconnect',
                data: {}
            });
        }

        function onFail() {
            console.log("websocket connect fail");
            if (NativeService.win) {
                NativeService.win.show();
            }
            $rootScope.$bus.publish({
                channel: 'websocket.event',
                topic: 'fail',
                data: {}
            });
            // TODO：移动端暂时取消
            // $state.go("disconnect");
        }

        function closeSocket() {
            if (socket) {
                socket.close();
                socket = null;
                $rootScope.$bus.publish({
                    channel: 'websocket.event',
                    topic: 'close',
                    data: {}
                });
            }
        }

        function doInit() {
            loginUser = UserService.getCurrentUser();
            if (loginUser == null) {
                // 可能还没有登录, 结果就没有用户信息了
                return;
            }
            isInit = true;
        }

        return {
            open: function () {
                if (!isInit) {
                    doInit();
                }
                if (loginUser == null) {
                    // 可能还没有登录, 结果就没有用户信息了
                    isInit = false;
                    return;
                }
                if (socket == null) {
                    socket = websocket.openMsgPush(loginUser.userId, loginUser.mobile, loginUser.userName, undefined, FLAGS, onMessage, onReconn, onFail, pkg.version, localIp, deviceId);
                    $rootScope.$bus.publish({
                        channel: 'websocket.event',
                        topic: 'connect',
                        data: {}
                    });
                }
            },
            send: function (message) {
                if (socket && socket.send) {
                    socket.send(message);
                }
            },
            destroy: function () {
                // 关闭WebSocket.
                closeSocket();
                loginUser = null;
                isInit = false;
            }
        };
    }

    service.$inject = deps;
    app.lazy.service("WebsocketService", service);
});
