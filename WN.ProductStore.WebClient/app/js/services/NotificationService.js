/**
 * Created by qiushaohua on 14-5-21.
 */
define([
    "app",
    "jquery"
], function(app, $) {

    var deps = ["$window", "$timeout", "$state"];

    var lastNotifyType = 0;

    function service($window, $timeout, $state) {
        /*
         // 由于在Chrome 里面, 只能在点击事件里面进行权限的请求(还不支持在ready 事件里面去触发权限的请求),
         // 所以改为在点击登录按钮的时候去申请权限
         $document.ready(function() {
         requestPermission($window);
         });*/

        return {
            /**
             * 在点击登录按钮的时候进行权限申请.
             */
            requestPermission: function() {
                requestPermission($window);
            },
        };
    }

    function supportNotification($window) {
        // Prior to Chrome 32, Notification.permission was not supported. 所以需要最后面那个判断, 不支持这个就不处理了.
        return $window.Notification && Notification.requestPermission && Notification.permission;
    }

    function requestPermission($window) {
        if (supportNotification($window) && Notification.permission !== "granted") {
            // 如果不允许, 则请求权限
            // (这玩意浏览器有做处理的, 只有设置过(不管是允许还是阻止), 就不会再弹出请求权限的提示了, 除非是没有选择直接关闭)
            Notification.requestPermission(function(status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    }

    service.$inject = deps;
    app.lazy.service("NotificationService", service);
});
