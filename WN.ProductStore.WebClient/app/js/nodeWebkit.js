/**
 * Created by IcyFenix on 2016/1/1.
 */
define([], function() {
    var node = function() {
        var gui = requireNode('nw.gui');
        var win = gui.Window.get();
        var notify = requireNode('nw-notify');

        function reloadDev() {
            notify.closeAll();
            // 向上-2016-11-23
            // 此处需要settimeout若干ms之后再reload，防止右下角提醒卡死
            // 但如果此处直接写setTimeout(function(){// reload}, 100)
            // 会有非常奇怪问题，1.在调试菜单中F5刷新，2.托盘区右键菜单重载程序，3.reload代码不执行
            // 确认是setTimeout引起的，因此通过事件把reload放在HomeController执行
            win.emit("auto-reloadDev");
        }

        return {
            requireNameConflict: function() {
                // 解决RequireJS和node-webkit的require名称冲突的问题
                window.require_js = window.require;
                window.fallbackRequire = function(a, b, c, d) {
                    var result;
                    try {
                        requireFromJS(function() {
                            result = require(a, b, c, d);
                        });
                    } catch (err) {
                        requireFromNode(function() {
                            result = require(a, b, c, d);
                        });
                    } finally {
                        window.require = window.fallbackRequire;
                    }
                    return result;
                };
                window.requireFromNode = function(requireCall) {
                    if (!window.requireNode) {
                        window.requireNode = function(name) {
                            if (name == 'nw.gui')
                                return nwDispatcher.requireNwGui();
                            return global.require(name);
                        }
                    }
                    window.require = window.requireNode;
                    requireCall();
                    window.require = window.fallbackRequire;
                };
                window.requireFromJS = function(requireCall) {
                    window.require = window.require_js;
                    requireCall();
                    window.require = window.fallbackRequire;
                };
                window.require = window.fallbackRequire;
            },
            initEmitterMaxListeners: function() {
                require('events').EventEmitter.prototype._maxListeners = 2;
            },
            initMemoryLeakWatchDog: function() {
                window.win_show_state = -1;
                window.realClose = false;
                win._events = null;
                var gc = false;
                setInterval(function() {
                    if (!gc) {
                        gc = true;
                        console.log("gc round will begin in next sleeping time");
                    }
                }, 60 * 60 * 1000);
                var dog = function() {
                    if (gc && !win.openSaasWinNum) {
                        reloadDev();
                    }
                };
                var showWindow = function() {
                    window.win_show_state = 1;
                    if (window.trayState === 1) {
                        window.trayState = 0
                    }
                }
                win.on('minimize', function() {
                    window.win_show_state = -1;
                    dog();
                });
                win.on('hide', function() {
                    window.win_show_state = -1;
                    dog();
                });
                win.on('focus', function() {
                    window.win_show_state = 1;
                });
                win.on('show', function() {
                    showWindow();
                });
                win.on('restore', function() {
                    showWindow();
                });
                win.on('close', function() {
                    if (!window.realClose) {
                        win.hide();
                        win.emit('hide');
                    } else {
                        win.close(true);
                    }
                });
            },
            initCrashDump: function() {
                gui.App.setCrashDumpDir(process.cwd() + "\\crash");
            },
            initExternalURLOpen: function() {
                window.openURL = function(url) {
                    gui.Shell.openExternal(url);
                }
            },
            executeWinCmd: function() {
                try {
                    var exec = require('child_process').exec;
                    var pathToAppIndex = window.location.href.replace('file:///', '');
                    var pathSegemnts = pathToAppIndex.split('/');
                    while (pathSegemnts.pop() != "src");
                    var path = pathSegemnts.join('\\') + '\\plugins\\Screenshot.dll';
                    exec('reg add "HKEY_CURRENT_USER\\Software\\MozillaPlugins\\@ali.com/screenshotPlugins" /v Path /t REG_SZ /d "' + decodeURI(path) + '" /f \n');
                } catch (e) {
                    //alert(e);
                }
            },
            registerGlobalHotKey: function() {
                // 唤醒
                var option = {
                    key: "Ctrl+Alt+X"
                };
                var shortcut = new gui.Shortcut(option);
                shortcut.on('active', function() {
                    win.show();
                    win.emit('show');
                });
                gui.App.unregisterGlobalHotKey(shortcut);
                gui.App.registerGlobalHotKey(shortcut);
                // 隐藏
                var option = {
                    key: "Ctrl+Alt+W"
                };
                var shortcut = new gui.Shortcut(option);
                shortcut.on('active', function() {
                    win.hide();
                    win.emit('hide');
                });
                gui.App.unregisterGlobalHotKey(shortcut);
                gui.App.registerGlobalHotKey(shortcut);
                // 截图
                var option = {
                    key: "Ctrl+Alt+A"
                };
                var shortcut = new gui.Shortcut(option);
                shortcut.on('active', function() {
                    $(".js-screenshot-input").click();
                });
                gui.App.unregisterGlobalHotKey(shortcut);
                gui.App.registerGlobalHotKey(shortcut);
            },
            forbidDragAndDrop: function() {
                // 屏蔽全窗口的拖放
                window.ondragover = function(e) {
                    e.preventDefault();
                    return false
                };
                window.ondrop = function(e) {
                    e.preventDefault();
                    return false
                };
            },
            registerLocalHotKey: function($scope, $rootScope) {
                var shiftpress = false;
                $(document).keydown(function(event) {
                    try {
                        //Alt+F4，Ctrl+W隐藏窗体，使用Keyup事件Alt+F4会在此代码执行之前关闭程序
                        if ((event.altKey && event.keyCode == 115) || (event.ctrlKey && event.keyCode == 87)) {
                            win.hide();
                            win.emit('hide');
                            event.stopPropagation();
                            return false;
                        }
                        //Ctrl+L转到人员搜索窗体
                        else if (event.ctrlKey && event.keyCode == 76) {
                            $("[ng-model='search.value']").focus();
                        }
                        // 按住shift截图
                        else if ($(".js-screenshot-input-editor").length > 0 && event.keyCode == 16) {
                            if (!shiftpress) {
                                $rootScope.showScrnshotNote = !$rootScope.showScrnshotNote;
                            }
                            shiftpress = true;
                        }
                        //登录界面敲回车直接登录
                        else if ($("button[title='请使用邮箱和域密码登录']") && event.keyCode == 13) {
                            $("button[title='请使用邮箱和域密码登录']").click();
                        }
                    } catch (e) {
                        return;
                    }
                });
                $(document).keyup(function(event) {
                    try {
                        if (event.keyCode == 16 && shiftpress) {
                            $rootScope.showScrnshotNote = !$rootScope.showScrnshotNote;
                            shiftpress = false;
                        }
                    } catch (e) {
                        return;
                    }
                });
            },
            autoUpdateCheck: function autoUpdateCheck(manualUpdateCheckCallBack) {
                setTimeout(function() {
                    var updater = require('node-webkit-updater');
                    // zzm:清除掉node.js的缓存，否则自动更新后还是会弹出更新对话框
                    delete global.require.cache[global.require.resolve('../../package.json')];
                    var pkg = require('../../package.json');
                    var upd = new updater(pkg);
                    var ncp = require('fs-extra').copy;
                    upd.checkNewVersion(function(error, newVersionExists, newPatchExists, manifest) {
                        if (null != error) {
                            return;
                        }
                        if (newVersionExists) {
                            var updateWin = gui.Window.open('updater.html', {
                                "position": "center",
                                "title": "自动更新",
                                "toolbar": false,
                                "frame": true,
                                "width": 550,
                                "height": 350,
                                "resizable": false,
                                "always-on-top": true,
                                "icon": "icons/logo.png",
                                "focus": true
                            });
                            updateWin.on('loaded', function() {
                                updateWin.window.setParent(require('nw.gui').Window.get(), manifest);
                            });
                        } else if (newPatchExists) {
                            upd.download(function (error, filename){
                                if (!error) {
                                    setTimeout(function(){
                                        upd.unpack(filename, function (error, newAppPath) {
                                            if (!error) {
                                                var dir;
                                                if (newAppPath.lastIndexOf('\\') > 0) {
                                                    dir = newAppPath.substr(0, newAppPath.lastIndexOf('\\'));
                                                } else {
                                                    dir = newAppPath.substr(0, newAppPath.lastIndexOf('/'));
                                                }
                                                ncp(dir, process.cwd(), function (error) {
                                                    if (!error) {
                                                        console.log('update patch');
                                                    } else {
                                                        console.log("文件复制异常：请确认登录用户对当前安装目录有读写控制权限。(操作步骤：文件夹->属性->安全; 请设置当前登录用户对该安装目录有读写权限。");
                                                    }
                                                });
                                            } else {
                                                console.log("文件解压异常：" + error);
                                            }
                                        }, manifest);
                                    }, 1000)
                                }
                            }, manifest, 'patch');
                        } else if (manualUpdateCheckCallBack) {
                            manualUpdateCheckCallBack();
                        }
                    })
                }, 0);
            },
            buildTray: function() {
                // 建立TrayMenu
                try {
                    var tray = new gui.Tray({
                        title: '93之家',
                        tooltip: '93之家',
                        icon: 'icons/tray.png'
                    });
                    tray.on('click', function() {
                        window.trayState = 0;
                        win.show();
                        win.emit('show');
                    });
                    var menu = new gui.Menu();
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '显示窗口',
                        click: function() {
                            window.trayState = 0;
                            win.show();
                            win.emit('show');
                        }
                    }));
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '调试菜单',
                        click: function() {
                            win.showDevTools();
                        }
                    }));
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '重载程序',
                        click: function() {
                            reloadDev();
                        }
                    }));
                    menu.append(new gui.MenuItem({
                        type: 'separator'
                    }));
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '注销用户',
                        click: function() {
                            win.emit("onlinesatuschange", {
                                status: '注销'
                            });
                        }
                    }));
                    menu.append(new gui.MenuItem({
                        type: 'normal',
                        label: '关闭程序',
                        click: function() {
                            window.realClose = true;
                            gui.App.closeAllWindows();
                        }
                    }));
                    tray.menu = menu;

                    window.trayState = 0;
                    window.busyTray = function() {
                        if (window.trayState === 0) {
                            tray.icon = "icons/tray.png";
                        } else {
                            if (tray.icon === "icons/tray.png") {
                                tray.icon = "icons/tray_msg.png";
                            } else {
                                tray.icon = "icons/tray.png";
                            }
                            setTimeout(window.busyTray, 350);
                        }
                    };
                    window.offlineTray = function() {
                        tray.icon = "icons/tray_offline.png";
                    };
                    window.onlineTray = function() {
                        tray.icon = "icons/tray.png";
                    };
                } catch (e) {
                    // 在普通Chrome调试，出现异常就忽略这段代码
                }
            },
            getOnlineStatusMenu: function() {
                return new Menu();
            }
        }
    };
    if (window.requireNode) {
        return node();
    } else {
        return {};
    }
});
