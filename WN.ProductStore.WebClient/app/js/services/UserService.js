define(["app", "services/LocalStorageService"], function(app) {

    var deps = ["$cookieStore", 'LocalStorageService'];

    var cookieUser = "CWSQLASTLOGIN";
    var cookiePwd = "CWSQLASTPWD";
    var cookieLastSpaceId = "CWSQLASTSPACEID";
    var VISITOR = "qysqvisitor";
    var cookieShowNotify = "CWSQSHOWNOTIFY";
    var cookieShowSound = "CWSQSHOWSOUND";
    var cookieStartUp = "CWSQSTARTUP";
    var cookieShowScrnshotNote = "CWSQSCRSHTNT";
    var cookieShowHotkey = "CWSQSHOWHK";
    var cookieHideHotkey = "CWSQHIDEHK";
    var cookieScreenShot = "CWSQSCREENHK";
    var cookieScreenShotEx = "CWSQSCREENHKEx";
    var cookiesTaskSort = "CWSQTASKSORT";
    var cookiesTaskTab = "CWSQTASKTAB";
    var cookiesRtc = "CWSQRTCOBJECT";

    var cookiesAuthToken = "YUNPANAUTHTOKEN";


    var local;

    function getIPAddress() {
        var tmp = [],
            local = {},
            eth = {};
        var isBrowser = window.runInBrowser();
        if (!isBrowser) {
            var interfaces = require('os').networkInterfaces();
            if (!interfaces) return null;
            for (var devName in interfaces) {
                var iface = interfaces[devName];
                for (var i = 0; i < iface.length; i++) {
                    var alias = iface[i];
                    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                        eth.ip = alias.address;
                        eth.device = alias.mac;
                        if (/^10.*/.test(eth.ip)) {
                            return eth;
                        }
                        tmp.push(eth);
                    }
                }
            }
            for (var idx in tmp) {
                var eth = tmp[idx];
                if (/^192.*/.test(eth.ip)) { //这里循环都是非10开头的取192开头
                    return eth
                }
            }
            return tmp[tmp.length - 1]; // 随意取
        } else {
            return {
                ip: '127.0.0.1',
                device: '0:0:0:0:0:0:0:1'
            }
        }
    }

    function service($cookieStore, LocalStorageService) {
        return {
            getLocalIp: function() {
                var ip = $cookieStore.get("localIp");
                if (!ip) {
                    var local = getIPAddress();
                    if (!local) return null;
                    $cookieStore.put("localIp", local.ip);
                    $cookieStore.put("device", local.device);
                    return local.ip;
                }
                return ip;
            },
            getDevice: function() {
                var device = $cookieStore.get("device");
                if (!device) {
                    var local = getIPAddress();
                    if (!local) return null;
                    $cookieStore.put("localIp", local.ip);
                    $cookieStore.put("device", local.device);
                    return local.device;
                }
                return device;
            },
            setTaskTab: function(type) {
                setCookie(cookiesTaskTab, type);
            },
            getTaskTab: function() {
                return getCookie(cookiesTaskTab);
            },
            setTaskSort: function(sort) {
                setCookie(cookiesTaskSort, sort);
            },
            getTaskSort: function() {
                return getCookie(cookiesTaskSort);
            },
            setRtc: function(rtcObj){
                setCookie(cookiesRtc, rtcObj);
            },
            getRtc: function(){
                return getCookie(cookiesRtc);
            },
            setAuthToken: function(authToken) {
                //setCookie(cookiesAuthToken, authToken);
            },
            getAuthToken: function() {
                return "7d39a55fb92b751b9c6dc1b43b8020845c5890f3"; //getCookie(cookiesAuthToken);
            },
            removeAuthToken: function() {
                $cookieStore.remove(cookiesAuthToken);
            },

            getCurrentUser: function() {
                return LocalStorageService.getItem('user')
            },

            removeCurrentUser: function() {
                LocalStorageService.removeItem("user");
            },

            updateCurrentUser: function(name, value) {
                var userVo = LocalStorageService.getItem('user');
                userVo[name] = value;
                LocalStorageService.setItem('user', userVo);
            },

            setLastLoginUser: function(loginName) {
                setCookie(cookieUser, loginName);
            },
            getLastLoginUser: function() {
                return getCookie(cookieUser);
            },
            setLastLoginPwd: function(encryptdPwd) {
                setCookie(cookiePwd, encryptdPwd);
            },
            getLastLoginPwd: function() {
                return getCookie(cookiePwd);
            },
            setShowNotify: function(ShowNotify) {
                setCookie(cookieShowNotify, ShowNotify ? "true" : "");
            },
            getShowNotify: function() {
                var ShowNotify = getCookie(cookieShowNotify);
                return ShowNotify && ShowNotify != "";
            },

            setShowSound: function(ShowSound) {
                setCookie(cookieShowSound, ShowSound ? "true" : "");
            },
            getShowSound: function() {
                var ShowSound = getCookie(cookieShowSound);
                return ShowSound && ShowSound != "";
            },

            setStartUp: function(StartUp) {
                setCookie(cookieStartUp, StartUp ? "true" : "");
            },
            getStartUp: function() {
                var StartUp = getCookie(cookieStartUp);
                return StartUp && StartUp != "";
            },

            setShowScrnshotNote: function(showScrnshotNote) {
                setCookie(cookieShowScrnshotNote, showScrnshotNote ? "true" : "");
            },
            getShowScrnshotNote: function() {
                var showScrnshotNote = getCookie(cookieShowScrnshotNote);
                return showScrnshotNote && showScrnshotNote != "";
            },

            setShowHotkey: function(ShowHotkey) {
                setCookie(cookieShowHotkey, ShowHotkey);
            },
            getShowHotkey: function() {
                return getCookie(cookieShowHotkey);
            },

            setHideHotkey: function(HideHotkey) {
                setCookie(cookieHideHotkey, HideHotkey);
            },
            getHideHotkey: function() {
                return getCookie(cookieHideHotkey);
            },

            setScreenShot: function(ScreenShot) {
                setCookie(cookieScreenShot, ScreenShot);
            },
            getScreenShot: function() {
                return getCookie(cookieScreenShot);
            },

            setScreenShotEx: function(ScreenShot) {
                setCookie(cookieScreenShotEx, ScreenShot);
            },
            getScreenShotEx: function() {
                return getCookie(cookieScreenShotEx);
            },

            setLastSpaceId: function(spaceId) {
                setCookie(cookieLastSpaceId, spaceId);
            },
            getLastSpaceId: function() {
                return getCookie(cookieLastSpaceId);
            },
            isVisitor: function() {
                var user = $cookieStore.get("user");
                return user && user.loginName == VISITOR;
            },

            getVisitorName: function() {
                return VISITOR;
            }
        };
    }

    function setCookie(key, value) {
        //写入cookie中，设置时间
        var expires = new Date();
        expires.setTime(expires.getTime() + 50 * 365 * 24 * 3600 * 1000);
        var _path = ";path=/";
        var _expires = ";expires=" + expires.toGMTString();
        document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + _expires + _path;
    }

    function getCookie(key) {
        var name = encodeURIComponent(key);
        var allcookies = document.cookie;
        name += "=";
        var pos = allcookies.lastIndexOf(name);
        if (pos !== -1) {
            var start = pos + name.length;
            var end = allcookies.indexOf(";", start);
            if (end === -1) {
                end = allcookies.length;
            }
            var value = allcookies.substring(start, end);
            return decodeURIComponent(value);
        }
    }

    service.$inject = deps;
    app.lazy.service("UserService", service);
});
