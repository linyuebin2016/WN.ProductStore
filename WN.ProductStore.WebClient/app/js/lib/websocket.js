/**
 * 消息推送服务器的地址.
 */
var MSG_PUSH_URI = "ws://93dev.ygsoft.com/msgpush";

/**
 * 对WebSocket使用的简化，实现接收服务端推送的消息.
 * @author chenxiangbai <br>
 * @version 1.0.0 2013-11-14 下午5:23:27 <br>
 */
var YGWebSocket = function(window, $) {
    var result = {};

    //MSG_PUSH_URI = window.location.host + "/msgpush";

    /**
     * 监听服务端的消息推送.
     * @param userId 当前接收消息的用户ID.
     * @param userName 当前接收消息的用户登录名称.
     * @param password 当前接收消息的用户密码.
     * @param listenFlags 客户端监听的消息类型标志，多个值用逗号连接.
     * @param callbak 客户端收到消息的回调事件.
     * @param reconnCallback 重连成功的时候进行的回调.
     */
    result.openMsgPush = function(userId, email, userName, password, listenFlags, callbak, reconnCallback, failCallback, version, localIp, device) {
        //创建WebSocket
        var webSocket;
        var reconnCount = 1;
        var websocketMissCount = 0;



        function conn() {
            var deferred = $.Deferred();
            try {
                //var protocal = location.protocol === 'https:' ? 'wss:' : 'ws:';
                var client = new WebSocket(MSG_PUSH_URI +
                    '/YGWebSocket?userId=' + userId +
                    "&userName=" + email +
                    "&password=" + password +
                    "&listenFlags=" + listenFlags +
                    "&clientFlag=" + (runInBrowser() ? "1" : "4") +
                    "&deviceId=" + device +
                    "&reuqestIp=" + localIp +
                    "&appName=web" +
                    "&appVersion=" + version);
                client.onopen = function(event) {
                    deferred.resolve(client, event);
                };
                client.onerror = function(event) {
                    deferred.reject(event);
                };
            } catch (err) {
                console && console.error(err);
                deferred.reject(err);
            }
            return deferred;
        }

        function doConn() {
            return conn().then(function(client, openEvent) {
                webSocket = client;
                initEvents(openEvent);
                reconnCount = 1;
            }, function() {
                reconnCount++;
                reConn();
            });
        }

        function reConn() {
            // 重连间隔定为10秒
            var time = 10000;
            if (reconnCount < 6) {
                // 如果是在1 分钟之内的, 则时间是递增的
                time = Math.pow(1.5, reconnCount) * 2000;
                console.log("第" + reconnCount + "次尝试重连，间隔时间：" + time);
                setTimeout(function() {
                    doConn().then(function() {
                        // 在reConn 里面表示进行重连了
                        // 进入这个回调表示成功了.
                        reconnCallback();
                    });
                }, time);
            } else {
                // 超过重试次数不成功就转到断线页面手动重连
                failCallback();
            }
        }

        function initEvents(openEvent) {

            //与服务端建立连接失败的回调
            webSocket.onerror = function(event) {
                // alert("与消息服务器建立连接出错");
                console && console.info(event);
            };

            // 与服务端建立连接成功的回调
            webSocket.onopen = function(event) {
                //alert("Connection established");
            };
            if (openEvent) {
                // 由于到这里的时候onopen 的事件已经触发过了, 所以这里再直接执行一次.
                webSocket.onopen(openEvent);
            }

            //服务端关闭连接的回调
            webSocket.onclose = function(event) {
                //alert("Connection closed");
                console && console.info(event);
                if (event.code !== 1000) {
                    // 不是正常关闭, 尝试重连
                    reConn();
                } else {
                    // 如果服务端已经主动关闭了，那客户端不应该停留在主界面
                    if (window.clientQuit === undefined || window.clientQuit === false) {
                        window.clientQuit = false;
                        failCallback();
                    }
                }
            };

            var msgs = {};

            // 定义Message事件处理函数(收取服务端消息并处理)
            webSocket.onmessage = function(event) {
                var msg = parseMessage(event.data);

                if (msg == null) {
                    callbak(null);
                    return;
                } else if (msg == 'ACK1') {
                    websocketMissCount = 0;
                    return;
                }
                if (msg.header == 'notify') {
                    callbak(msg.extras);
                    return;
                }
                // send confirm
                webSocket.send('CFM' + msg.header);
                if (msgs[msg.header]) {
                    // 已经处理过这个消息了.
                    return;
                }

                msgs[msg.header] = new Date().getTime();

                var data = $.parseJSON(msg.content);
                callbak(data);

                setTimeout(clearMsgs, 1000);
            };

            var HALF_HOUR = 30 * 60 * 1000;

            function clearMsgs() {
                var now = new Date().getTime();
                for (var header in msgs) {
                    if (msgs.hasOwnProperty(header)) {
                        var time = msgs[header];
                        if (time + HALF_HOUR < now) {
                            // 删除半个小时前的信息
                            delete msgs[header];
                        }
                    }
                }
            }
        }

        doConn();

        // 返回关闭的函数, 直接调用则关闭socket

        return {
            close: function() {
                if (webSocket) {
                    webSocket.close();
                }
            },
            send: function(message) {
                if (webSocket) {
                    webSocket.send(message);
                    if (message == 'HBT1') {
                        websocketMissCount++;
                        if (websocketMissCount > 6) {
                            reConn();
                        }
                    }
                } else {
                    doConn();
                }
            }
        };

    };

    var headerLenFieldLength = 4;
    var notifyLenFieldLength = 6;

    function parseMessage(msg) {

        if (!msg || msg.length < headerLenFieldLength) {
            return null;
        }

        var notify = msg.substring(0, notifyLenFieldLength);

        if (notify == 'ACK1') {
            return notify;
        } else if (notify == 'CMDKCK') { // 踢掉本人其他设备
            return {
                header: 'notify',
                extras: {
                    listenFlag: "noteRemind",
                    noteType: 0,
                    content: "您" + msg.replace("CMDKCK:", "") + " 设备离线"
                }
            };
        } else if (notify == 'CMDOFL') { // 本人其他设备下线通知
            return {
                header: 'notify',
                extras: {
                    listenFlag: "noteRemind",
                    noteType: 0,
                    content: "您" + msg.replace("CMDOFL:", "") + " 设备离线"
                }
            };
        } else if (notify == 'CMDONL') { // 本人其他设备上线通知
            return {
                header: 'notify',
                extras: {
                    listenFlag: "noteRemind",
                    noteType: 0,
                    content: "您" + msg.replace("CMDONL:", "") + "设备在线"
                }

            };
        }
        var headerLength = parseInt(msg.substring(0, headerLenFieldLength));
        if (!headerLength) {
            return null;
        }
        return {
            header: msg.substring(headerLenFieldLength, headerLength + headerLenFieldLength),
            content: msg.substring(headerLength + headerLenFieldLength)
        };
    }

    return result;
}(window, jQuery);
