define([
    'app',
    'jquery',
    'angular',
    'emoji',
    'services/EmotionService',
    "services/NativeService",
    'controllers/common/ImgViewController',
    'resources/ConversationResource',
    'directives/ImageViewable'
], function (app, $, angular, emoji) {

    'use strict';

    var deps = ['$timeout', '$modal', 'EmotionService', "BaseService", "NativeService", "ConversationResource"];

    function directive($timeout, $modal, EmotionService, BaseService, NativeService, ConversationResource) {
        return {
            link: function ($scope, element, attrs) {
                var filters = [];
                $scope.baseUrl = BaseService.restfulUrl;
                $scope.$watch(attrs.fcBindHtml, function (newValue) {
                    var html = angular.copy(newValue);
                    var parseConfig = {
                        abbreviate: attrs.abbreviate === 'true',
                        imgViewable: attrs.imgviewable === 'true',
                        hastag: attrs.hashtag === 'true',
                        atUser: attrs.atUser === 'true',
                        userpanel: attrs.userpanel === 'true',
                        emotionType: attrs.emotionType,
                        command: attrs.command === 'true',
                        channelcard: attrs.channelcard === 'true'
                    };
                    element.html(getAsTrustedHtml(html, parseConfig));

                    /** 判断是否需要有点击图片展开大图的功能 **/
                    if (!(parseConfig.imgViewable || parseConfig.userpanel)) {
                        return;
                    }
                    if (runInBrowser()) {
                        openPicInBrowser()
                    } else {
                        openPicLocal();
                    }
                });

                function openPicInBrowser() {
                    setTimeout(function () {
                        var $img = element.find('.imgViewAble');
                        $img.off('click');
                        $img.on('click', function (event) {
                            var picId = $(event.target).attr("picId");
                            event.stopPropagation();
                            if (!picId || picId == "") {
                                return;
                            }
                            $modal.open({
                                templateUrl: 'views/common/imgView/ImgView.html',
                                controller: "ImgViewController",
                                backdrop: true,
                                resolve: {
                                    picId: function () {
                                        return picId;
                                    }
                                },
                                keyboard: true,
                                windowClass: "imgView-dialog-window"
                            });
                        });
                    }, 50);
                }

                function openPicLocal() {
                    setTimeout(function () {
                        var $img = element.find('.imgViewAble');
                        $img.off('click');
                        $img.on('click', function (event) {
                            var picId = $(this).attr('picId');
                            event.stopPropagation();
                            if (!picId || picId === '') {
                                return;
                            }
                            var url = encodeURIComponent(BaseService.restfulUrl + "fileUploadController/showPic/" + picId);
                            var imgViewWin = NativeService.openWindow("views/common/imgView/NodeWebkitImgView.html?src=" + url + "?picType=3", {
                                title: "图片浏览",
                                fullscreen: true,
                                transparent: true,
                                "always-on-top": true,
                                resizable: true
                            });
                            imgViewWin.on('loaded', function () {
                                var nextPicId = '[' + picId + ']';
                                if ($scope.chat && $scope.chat.createDate) {
                                    var timeStrap = $scope.chat.createDate;
                                    imgViewWin.window.initWebkitWin(function (type) {
                                        ConversationResource.queryImageConversation($scope.chat.topicId, nextPicId, type, timeStrap).success(function (data) {
                                            if (data && data.dialogueInfo) {
                                                nextPicId = data.dialogueInfo;
                                                timeStrap = data.createDate;
                                                imgViewWin.window.setImage(BaseService.restfulUrl + "fileUploadController/showPic/" + data.dialogueInfo.replace(']', '').replace('[', '') + "?picType=3");
                                            }
                                        })
                                    })
                                }
                            });
                        });
                    }, 50);
                }

                function getAsTrustedHtml(html, parseConfig) {
                    if (!html) {
                        return html;
                    }
                    return filter(html, parseConfig);
                }

                function filter(html, parseConfig) {
                    angular.forEach(filters, function (item) {
                        html = item(html, parseConfig);
                    });
                    return html;
                }

                function emotionsFilter(html, parseConfig) {
                    if (/<img src="images\/emoticons\/[\d]+.png">/.test(html)) {
                        // 改表情发送模式后兼容旧版资讯号评论<img src="images/emoticons/1.png">类型的表情
                        var matches = html.match(/\<img src="images\/emoticons\/[\d]+.png">/g);
                        for (var i = 0; i < matches.length; i++) {
                            var number = matches[i].replace(/[^\d]/g, '');
                            html = html.replace(matches[i], '[' + number + ']');
                        }
                    }
                    html = EmotionService.resolve(html, parseConfig);
                    if (/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/.test(html)) {
                        html = emoji.unifiedToHTML(html);
                    }
                    if (parseConfig.abbreviate) {
                        var regEmotion = /<img.*?src="images\/emoticons\/.*?(gif|png).*?>/g
                        if (regEmotion.test(html)) {
                            return html.replace(regEmotion, '[表情]');
                        }
                    }
                    return html;
                }

                function imagesFilter(html, parseConfig) {
                    //处理图片 ，如[5398159361386b469752a474]
                    var reg = /\[([a-z0-9]{24})\]/g;
                    if (parseConfig.abbreviate) {
                        return html.replace(reg, '[图片]');
                    }
                    return html.replace(reg, '<img ng-cancel-drag src="' + BaseService.restfulUrl + 'fileUploadController/showPic/$1?picType=0" class="imgViewAble hand" picid="$1" />');
                }

                function userPanelImgFilter(html, parseConfig) {
                    if (parseConfig.userpanel) {
                        return '<img ng-cancel-drag src="' + BaseService.restfulUrl + 'fileUploadController/showPic/' + html + '" class="img-circle img-card-user imgViewAble hand" picid="' + html + '" ondragstart="return false;"/>';
                    }
                    return html;
                }

                function lineFilter(html, parseConfig) {
                    //处理换行符
                    var reg = /(\r\n)|(\n)|(\r)|(<br\/?>)/g;
                    if (parseConfig.abbreviate) {
                        html = html.replace(/<id.*?id>/, "");
                        return html.replace(reg, ' ');
                    }
                    var text = html.replace(reg, '<br>');
                    //旧版PC端发送的带有<span>标签处理
                    var regSpan = /<span.+?onclick=openURL.+?>/
                    if (regSpan.test(html)) {
                        text = text.replace(regSpan, '').replace('</span>', '');
                    }
                    //旧版PC端发送的带有<a>标签处理
                    var regA = /<a target="_blank".+?href=".+?>/
                    if (regA.test(html)) {
                        text = text.replace(regA, '').replace('</a>', '');
                    }
                    //旧版PC端发送的带有<font>标签处理
                    regSpan = /<font.*?>/i
                    if (regSpan.test(text)) {
                        text = text.replace(regSpan, '').replace(/<\/font>/i, '');
                    }
                    // 网址点击直接打开
                    var regWeb = /(http|https|www|ftp)[^\u4E00-\u9FFF^(\s	  \<\(\)\>\[\]\{\}\!\@\$\^\*\'\"\,\“\”\，)]*/g;
                    // 是网址格式，且不是CC中的图片，且不是cici全文检索，且不是cici的命令打开网页
                    if (regWeb.test(text) && text.indexOf('webapp/restful') == -1 && text.indexOf('10.51.111.101:81/docs') == -1 && !/\{["']url['"]:['"](http|https|www|ftp).*?["']\}/.test(text)) {
                        text = text.replace(/&nbsp;/g, ' ');
                        text = text.replace(regWeb, function () {
                            var webAddress = arguments[0].replace(/<.*?>/, '');
                            var jsonObj = {
                                type: 5,
                                content: {
                                    url: webAddress
                                }
                            };
                            var aObj = "<a ng-cancel-drag href=javascript:iswCommand('" + null + "','" + null + "'," + JSON.stringify(jsonObj) + ") class='hand webaddress' ondragstart='return false;'>" + webAddress + "</a>";
                            return aObj;
                        });
                    }
                    if (parseConfig.channelcard) {
                        // 转发资讯号文本显示
                        text = text.replace(/<.*?>/gi, '');
                        if (text.length > 35) {
                            text = text.substr(0, 35) + '...';
                        }
                    }
                    // 防止改包引起的xss攻击
                    // <span style="font-size:14px; font-weight:bold;"><img src="#" onerror="alert(/XSS/)"></span>
                    if (/img.*?onerror/.test(text)) {
                        text = text.replace(/img.*?onerror/, '');
                    }
                    if (/<[\/]{0,1}script>/.test(text)) {
                        text = text.replace(/<[\/]{0,1}script>/, '');
                    }
                    if (/<[^\/].*?>/.test(text)) {
                        text = text.replace(/<([^\/])(.*?)>/g, "<$1$2 ng-cancel-drag>");
                    } else {
                        text = '<span ng-cancel-drag>' + text + '</span>'
                    }
                    return text;
                }

                function plainTextFilter(html, parseConfig) {
                    if (parseConfig.abbreviate) {
                        return html.replace(/<[^>]+>/g, "").replace(/@&@.*?@&@/g, "");
                    }
                    return html;
                }

                function commandFilter(html, parseConfig) {
                    var reg = /@&@.*?@&@/g;
                    if (parseConfig.command) {
                        var commands = html.match(reg);
                        if (!commands) return html;
                        for (var i = 0; i < commands.length; i++) {
                            var json = commands[i].match(/@\{.*?\}@/);
                            var aObj = ""
                            if (json && json.length > 0) {
                                json = json[0].replace(/@/g, "").replace(/\'/g, "\"");
                                var jsonObj = JSON.parse(json);
                                aObj = "<a ng-cancel-drag href=javascript:iswCommand('" + null + "','" + attrs.whoami + "'," + json.replace(/ /g, '') + ") class='hand' ondragstart='return false;'>" + jsonObj.name + "</a>";
                            } else {
                                var name = commands[i].replace(/@&@/g, "");
                                aObj = "<a ng-cancel-drag href=javascript:iswCommand('" + commands[i].replace(/@\&@/g, "").replace(/\{.*?\}/, "") + "','" + attrs.whoami + "'," + null + ") class='hand' ondragstart='return false;'>" + name + "</a>";
                            }
                            html = html.replace(commands[i], aObj);
                        }
                        return html;
                    }
                    return html;
                }

                function hashTagFilter(html, parseConfig) {
                    // 有#.*#的话题形成超链接
                    var reg = /#([a-zA-Z0-9\u4e00-\u9fa5\ ]+)#/g;
                    if (parseConfig.hastag) {
                        var hashtags = html.match(reg);
                        if (!hashtags) return html;
                        for (var i = 0; i < hashtags.length; i++) {
                            var aObj = "<a href=javascript:selectHashTag('" + hashtags[i].replace(/[\#\ ]/g, "") + "') class='hand' title='查看该话题'>" + hashtags[i] + "</a>";
                            html = html.replace(new RegExp(hashtags[i], "gm"), aObj);
                        }
                        return html;
                    }
                    return html;
                }

                function atUserFilter(html, parseConfig) {
                    var atReg = /@([a-zA-Z0-9\u4e00-\u9fa5]+)/g;
                    if (parseConfig.atUser) {
                        var atUsers = html.match(atReg);
                        if (!atUsers) return html;
                        for (var j = 0; j < atUsers.length; j++) {
                            var atObj = "<a href=javascript:atUser('" + atUsers[j] + "') class='hand'>" + atUsers[j] + "</a>";
                            html = html.replace(new RegExp(atUsers[j], "gm"), atObj);
                        }
                    }
                    return html;
                }

                filters.push(userPanelImgFilter);
                filters.push(imagesFilter);
                filters.push(lineFilter);
                filters.push(plainTextFilter);
                filters.push(hashTagFilter);
                filters.push(atUserFilter);
                filters.push(emotionsFilter);
                filters.push(commandFilter);
            }
        };
    }

    directive.$inject = deps;
    app.lazy.directive('fcBindHtml', directive);

});
