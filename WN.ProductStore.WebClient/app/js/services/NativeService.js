/**
 * Created by zhouzhiming on 16-1-1.
 */

define(["app"], function(app) {

    var deps = ["$rootScope", "$window"];
    var openWindows = {};
    // 如果在Chrome中调试，返回一个NativeService的外壳，保证能正常运行
    try {
        var gui = require('nw.gui');
    } catch (e) {
        app.lazy.service("NativeService", function() {
            return {
                initWindowControl: function() {}
            }
        });
        return;
    }

    var win = gui.Window.get();

    var service = function($rootScope, $window) {
        return {
            gui: gui,
            win: win,
            closeApp: function() {
                gui.App.closeAllWindows();
            },
            show: function() {
                win.show();
                win.emit('show');
            },
            hide: function() {
                win.hide();
                win.emit('hide');
            },
            clearOpenWindow: function(){
                for (var key in openWindows) {
                    openWindows[key].close();
                }
            },
            openWindow: function(url, options) {
                if (!url) {
                    return;
                }
                if (!runInBrowser()) {
                    var openWindow;
                    if (openWindows[url]) {
                        openWindows[url].close();
                    }
                    var _options = $.extend({
                        "position": "center",
                        "toolbar": false,
                        "frame": false,
                        "icon": "icons/logo.png",
                        "focus": true
                    }, options);
                    openWindow = gui.Window.open(url, _options);
                    openWindow.on('closed', function() {
                        if (openWindows[url]) {
                            delete openWindows[url];
                        }
                    });
                    setTimeout(function() {
                        openWindows[url] = openWindow;
                    }, 100)
                    return openWindow;
                }
            },
            openWindowExternal: function(url) {
                gui.Shell.openExternal(url);
            },
            openItem: function(fileName) {
                gui.Shell.openItem(fileName);
            },
            showItemInFolder: function(fileName) {
                gui.Shell.showItemInFolder(fileName);
            },
            childPprocessExec: function(url) {
                //var url = 'echo&&start "" "C:\\Program Files\\Internet Explorer\\iexplore.exe" "http://10.*.*.*:9080/newxs/index0.jsp"';
                var exec = require('child_process').exec;
                exec(url);
            },
            shake: function(times, radius, step) {
                // 重复次数， 旋转半径， 细分
                var delay = 0;
                if (window.win_show_state != 1) {
                    win.show();
                    delay = 300;
                }
                setTimeout(function() {
                    var top = $window.screenTop;
                    var left = $window.screenLeft;
                    var delay = 4;
                    win.moveTo(left + radius, top);
                    var moveto = function(x, y, _delay) {
                        setTimeout(function() {
                            win.moveTo(x, y);
                        }, _delay)
                    }
                    for (var i = 0; i < times; i++) {
                        for (var j = 0; j < step; j++) {
                            var degrees = j * 0.017453293 * 360 / step;
                            var x = parseInt(radius * Math.cos(degrees));
                            var y = parseInt(radius * Math.sin(degrees));
                            moveto(left + x, top + y, delay * (j + i * step));
                        }
                    }
                    moveto(left, top, delay * (j + (i - 1) * step));
                    if (top == 0 && left == 0) {
                        win.maximize();
                    }
                }, delay)
            },
            initWindowControl: function(realClose) {
                $rootScope.win_state = 0;
                $rootScope.minWindow = function() {
                    win.minimize();
                };
                $rootScope.maxWindow = function() {
                    if ($rootScope.win_state === 0) {
                        $rootScope.win_state = 1;
                        win.maximize();
                    } else {
                        $rootScope.win_state = 0;
                        win.restore();
                    }
                };
                if (realClose) {
                    $rootScope.closeWindow = this.closeApp;
                } else {
                    $rootScope.closeWindow = function() {
                        win.hide();
                        win.emit('hide');
                    };
                }
            }
        };
    };

    service.$inject = deps;
    app.lazy.service("NativeService", service);
});
