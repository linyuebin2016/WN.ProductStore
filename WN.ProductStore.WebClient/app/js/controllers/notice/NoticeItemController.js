define(["app",
    "services/BaseService",
    'resources/NoticeResource',
    "directives/NoticeHtml",
    "services/SessionStorageService"

], function (app) {

    "use strict";

    var deps = ["$scope", "$state", "$stateParams", 'NoticeResource', 'BaseService', 'SessionStorageService'];

    function controller($scope, $state, $stateParams, NoticeResource, BaseService, SessionStorageService) {
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.runInBrowser = runInBrowser();

        $scope.currentUser = SessionStorageService.getItem("user");

        //接收传值
        var categoryId = $stateParams.categoryId;
        $scope.categoryName = $stateParams.categoryName;
        var limit;
        //取得通知列表 不传值为取得全部
        $scope.getNoticeList = function (categoryId) {
            if (!$scope.timestamp) {
                // 没有时间戳, 则是第一次加载, 则只加载10 条或者 (未读数 + 10)
                limit = 10;
            }
            NoticeResource.queryUserNotices(categoryId, $scope.timestamp, limit).success(function (result) {
                if (result && result.dialogues && result.dialogues.length > 0) {
                    $scope.timestamp = result.dialogues[result.dialogues.length - 1].createDate;
                }
                if ($scope.topic) {
                    [].unshift.apply($scope.topic.dialogues, result.dialogues || []);
                } else {
                    $scope.topic = result;
                    if (!result.dialogues) {
                        // 处理一下为空的情况
                        result.dialogues = [];
                        $scope.zeroNotice = true;
                    }
                    var noticeObjList = [];
                    for (var i = 0; i < result.dialogues.length; i++) {
                        var value = result.dialogues[i].dialogueInfo;
                        var value1 = '';
                        var url = '';
                        var noticeObj = {};
                        var lastspace = value.lastIndexOf("&&&");
                        if (lastspace != -1) {
                            value1 = value.substr(0, lastspace);
                            value1 = value1.replace(/<a>/g, '');
                            value1 = value1.replace(/<\/a>/g, '');
                            url = value.substr(value.indexOf('&&&') + 3, value.length);
                        } else {
                            value1 = value;
                            url = '';
                        }
                        noticeObj['url'] = url;
                        noticeObj['dialogueInfo'] = value1;
                        noticeObj['typeName'] = getTypeName(result.dialogues[i].dialogueType)
                        console.log(noticeObj);
                        noticeObjList.push(noticeObj);
                    }
                    console.log(noticeObjList);
                    $scope.noticeList = noticeObjList;
                }
                if (!result.dialogues || result.dialogues.length < 10) {
                    // 没有更多了.(直接就没有会话内容了, 或者个数小于查询的数量, 那表明已经没有了.)
                    $scope.topic.loadedAll = true;
                }
            });
        }

        //写死模块类型 1: 征集 2:资讯号 3:社务工作 4: 互助 5 : 话题 6: 我的声音 7: 好书 8: 93之声 9: 积分换礼 10: 找人
        function getTypeName(type){
            //
            if(type==1) return "参政议政";
            if(type==2) return "资讯号";
            if(type==3) return "社务工作";
            if(type==4) return "互助";
            if(type==5) return "话题";
            if(type==6) return "我的声音";
            if(type==7) return "好书";
            if(type==8) return "93之声";
            if(type==9) return "积分换礼";
            if(type==10) return "找人";
            else return "通知";
        }

        $scope.getNoticeList(categoryId);


        $scope.scrollHandler = scrollHandler;

        function scrollHandler() {
            pageNo++;
            getNoticeList().success(function loadedScrollChannelItems(channelItems) {
                if (channelItems == null || channelItems.length < pageSize) {
                    $scope.scrollHandler = function noop() {
                    };
                }
            });
        }

        $scope.goToNoticeDetail = function (url) {
            var url1 = url.substr(0, url.indexOf('#'));
            if (url1 == ".polity.collectDetail") {
                url1 = url1.replace('.polity', '');
            }
            var para = url.substr(url.lastIndexOf('#') + 1, url.length)
            para = para.replace(/\*/g, '\"');
            var obj = JSON.parse(para); //由JSON字符串转换为JSON对象
            $state.go("home" + url1, obj);
        }


    }

    controller.$inject = deps;
    app.lazy.controller("NoticeItemController", controller);
});
