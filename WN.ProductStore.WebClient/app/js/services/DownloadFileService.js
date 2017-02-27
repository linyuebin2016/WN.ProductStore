define(["app",
    "services/UserService",
    "services/TipsService",
    'services/MessageBox',
    "services/LocalStorageService"
], function(app) {

    var deps = ['BaseService', 'TipsService', 'UserService', '$timeout', '$q', 'LocalStorageService', 'MessageBox'];

    function service(BaseService, TipsService, UserService, $timeout, $q, LocalStorageService, MessageBox) {

        function getLastDir() {
            var lastDir = LocalStorageService.getItem('lastDirectory', lastDir);
            if (runInBrowser()) {
                return null;
            }
            if (!lastDir) {
                var env = require("process").env;
                if (env.USERPROFILE) {
                    lastDir = env.USERPROFILE + '\\Downloads'
                }
            }
            try {
                var fs = require('fs');
                fs.statSync(lastDir); // 路径不存在，报错
                LocalStorageService.setItem('lastDirectory', lastDir);
                return lastDir;
            } catch (e) {
                var os = require('os');
                return os.tmpdir();
            }
        }

        return {
            downloadfile: function(url, fileName, open) {
                var fs = require('fs');
                var gui = require('nw.gui');
                var win = gui.Window.get();
                var xhr = new XMLHttpRequest();
                win.setProgressBar(-1);
                xhr.open('GET', url, true);
                xhr.responseType = "arraybuffer";
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        var arrayBuffer = xhr.response,
                            byteArray = new Uint8Array(arrayBuffer);
                        var buffer = new Buffer(byteArray.length);
                        for (var i = 0; i < byteArray.length; i++) {
                            buffer.writeUInt8(byteArray[i], i);
                        }
                        fs.writeFile(fileName, buffer, function(error) {
                            if (!error && open) {
                                gui.Shell.openItem(fileName);
                            }
                        });
                        win.setProgressBar(-1);
                    }
                };
                xhr.addEventListener("progress", function(e) {
                    win.setProgressBar(e.loaded / e.total);
                });
                xhr.send();
            },
            beforeDownloadFileConfirm: function(fileName, attachsName, onsuccess) {
                var confirm = LocalStorageService.getItem('beforeDownloadFileConfirm');
                if (confirm === null) {
                    confirm = true;
                }
                if (confirm === true) {
                    var d = MessageBox.confirmResult({
                        msg: '文件保存路径为"' + fileName + '"，再次打开会覆盖之前修改，修改后请及时"另存为"',
                        header: '打开确认',
                        yesButton: '不再提醒',
                        noButton: '我知道了'
                    });
                    d.result.then(function(result) {
                        if (result === "yes") {
                            LocalStorageService.setItem('beforeDownloadFileConfirm', false)
                        } else {
                            LocalStorageService.setItem('beforeDownloadFileConfirm', true)
                        }
                        onsuccess();
                    });
                } else {
                    onsuccess();
                }
            },
            downloadYunDiskFile: function(url, fileName, token) {
                var fs = require('fs');
                var gui = require('nw.gui');
                var win = gui.Window.get();
                var xhr = new XMLHttpRequest();
                win.setProgressBar(-1);
                xhr.open('GET', url, true);
                xhr.responseType = "arraybuffer";
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        var arrayBuffer = xhr.response,
                            byteArray = new Uint8Array(arrayBuffer);
                        var buffer = new Buffer(byteArray.length);
                        for (var i = 0; i < byteArray.length; i++) {
                            buffer.writeUInt8(byteArray[i], i);
                        }
                        fs.writeFile(fileName, buffer, function(error) {
                            if (!error) {
                                gui.Shell.openItem(fileName);
                            }
                        });
                        win.setProgressBar(-1);
                    }
                };
                xhr.addEventListener("progress", function(e) {
                    win.setProgressBar(e.loaded / e.total);
                });
                xhr.setRequestHeader('Authorization', token);
                xhr.send();
            },

            checkFileType: function(attachType) {
                var imgRegExp = new RegExp('(jpg|gif|bmp|png|jpeg|svg|tiff)', 'i'),
                    docRegExp = new RegExp('(doc|docx|rtf|docm)', 'i'),
                    pptRegExp = new RegExp('(ppt|pptx|dps|potx|ppsx|pptm)', 'i'),
                    xlsRegExp = new RegExp('(xls|xlsx|et|xlsb|xlsm|xltm|xltx)', 'i'),
                    zipRegExp = new RegExp('(zip|rar|7z|bz|gz|iso|dmg)', 'i'),
                    pdfRegExp = new RegExp('(pdf)', 'i'),
                    mp3RegExp = new RegExp('(mp3|midi|wav|wma|mid)', 'i'),
                    movRegExp = new RegExp('(rm|rmvb|avi|mp4|mkv)', 'i'),
                    codeRegExp = new RegExp('(java|html|css|js|jar|war)', 'i'),
                    cebRegExp = new RegExp('(ceb)', 'i'),
                    exeRegExp = new RegExp('(exe)', 'i'),
                    txtRegExp = new RegExp('(txt)', 'i');
                if (imgRegExp.test(attachType)) {
                    return "img";
                }
                if (docRegExp.test(attachType)) {
                    return "doc";
                }
                if (pptRegExp.test(attachType)) {
                    return "ppt";
                }
                if (xlsRegExp.test(attachType)) {
                    return "xls";
                }
                if (zipRegExp.test(attachType)) {
                    return "zip";
                }
                if (movRegExp.test(attachType)) {
                    return "mov";
                }
                if (pdfRegExp.test(attachType)) {
                    return "pdf";
                }
                if (mp3RegExp.test(attachType)) {
                    return "mp3";
                }
                if (codeRegExp.test(attachType)) {
                    return "code";
                }
                if (cebRegExp.test(attachType)) {
                    return "ceb";
                }
                if (exeRegExp.test(attachType)) {
                    return "exe";
                }
                if (txtRegExp.test(attachType)) {
                    return "txt";
                }
                return "common";
            },

            downloadImage: function(picId, name) {
                var url = (BaseService.restfulUrl + "fileUploadController/showPic/" + picId + "?picType=3");
                $timeout(function() {
                    var aLink = document.createElement('a');
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
                    aLink.download = name || picId + ".jpg" || "保存图片.jpg";
                    aLink.href = url;
                    aLink.dispatchEvent(evt);
                }, 50);
            },

            downloadAllImage: function(picIds) {
                var gui = require('nw.gui');
                var win = gui.Window.get();
                var asycDownloadImage = function(X) {
                    var defer = $q.defer();
                    var xhr = new XMLHttpRequest();
                    var fs = require('fs');
                    var url = (BaseService.restfulUrl + "fileUploadController/showPic/" + picIds[X].replace('[', '').replace(']', ''));
                    xhr.open('GET', url, true);
                    xhr.responseType = "arraybuffer";
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            var arrayBuffer = xhr.response,
                                byteArray = new Uint8Array(arrayBuffer);
                            var buffer = new Buffer(byteArray.length);
                            for (var i = 0; i < byteArray.length; i++) {
                                buffer.writeUInt8(byteArray[i], i);
                            }
                            fs.writeFile(getLastDir() + "\\" + X + ".jpg", buffer, function(error) {
                                defer.resolve();
                            });
                        }
                    };
                    xhr.send();
                    return defer.promise;
                };
                var arrayPromise = [];
                for (var X = 0; X < picIds.length; X++) {
                    arrayPromise.push(asycDownloadImage(X));
                }
                $q.all(arrayPromise).then(function() {
                    TipsService.show('文件下载完成。');
                    gui.Shell.openItem(getLastDir());
                    arrayPromise = [];
                });
            },
            downloadFiletoDisk: function(url, name) {
                $timeout(function() {
                    var aLink = document.createElement('a');
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
                    aLink.download = name || "NoName";
                    aLink.href = url;
                    aLink.dispatchEvent(evt);
                }, 50);
            },
            setLastDir: function(lastDir) {
                if (lastDir) {
                    LocalStorageService.setItem('lastDirectory', lastDir);
                    return
                }
                var lastDir;
                var env = require("process").env;
                if (env.USERPROFILE) {
                    lastDir = env.USERPROFILE + '\\Downloads'
                }
                LocalStorageService.setItem('lastDirectory', lastDir);
            },
            getLastDir: function() {
                return getLastDir();
            }
        };
    }

    service.$inject = deps;
    app.lazy.service("DownloadFileService", service);
});
