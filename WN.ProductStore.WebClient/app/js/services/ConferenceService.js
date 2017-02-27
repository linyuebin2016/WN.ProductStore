define(["app",
    "resources/ConferenceResource",
    'services/MessageBox',
    'services/TipsService',
    "controllers/common/ConferencePickerController"
], function (app) {

    var deps = ['$modal', 'ConferenceResource', 'TipsService', 'MessageBox'];

    function conferenceService($modal, ConferenceResource, TipsService, MessageBox) {
        return {
            createConference: function (userId, currentCompanyCode, topic) {
                ConferenceResource.queryUserPermission(userId, currentCompanyCode).success(function (result, status, headers, config) {
                    var conferenceType;
                    // topic.converVo.topicType != 1多方通话conferenceType=2，否则双人通话conferenceType=3
                    if (result.doubleAuthority || result.confAuthority) {
                        if (topic.converVo.topicType === 1) {
                            //双人电话会议
                            var d = MessageBox.confirmResult("<span style='font-size: 14px; display: block'>是否开始拨打电话？</span><br><img src='images/apps/cht.png' style='width: 60px;vertical-align: \
                                                                bottom'><ul style='  display: inline-block; padding: 10px 0 0 10px; font-size: 14px;'><li>语音通话服务由“远光畅会通”提供</li><li>\
                                                                您的本月免费通话时长剩余" + parseInt(result.callTime / 60) + "分钟</li></ul>");
                            d.result.then(function (msgBox) {
                                if (msgBox === 'yes') {
                                    // var date = new Date();
                                    // var conferenceName = date.getFullYear().toString() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes();
                                    createConference(ConferenceResource, TipsService, userId, currentCompanyCode, topic, null, conferenceType, result);
                                }
                            });
                        } else {
                            //多人电话会议
                            multiConferenceWin($modal, result.confCallTime, topic).result.then(function(data){
                                if (data) {
                                    var conferenceName = data.conferenceName;
                                    topic.participants = data.memberList;
                                    createConference(ConferenceResource, TipsService, userId, currentCompanyCode, topic, conferenceName, null, result);
                                }
                            });
                        }
                    } else {
                        TipsService.show("通话时间不足或权限不足，请联系客服");
                    }
                });
            }
        };
    }

    var multiConferenceWin = function ($modal, callTime, topic) {
        return $modal.open({
            templateUrl: 'views/common/ConferencePicker.html',
            controller: "ConferencePickerController",
            backdrop: "static",
            keyboard: false,
            resolve: {
                type: function () {
                    return "user";
                },
                title: function () {
                    return "使用畅会通PC版发起电话会议（剩余时间：" + parseInt(callTime / 60) + "分钟）";
                },
                orgType: function () {
                    return 1;
                },
                callTime: function () {
                    return callTime;
                },
                topicVo: function(){
                    return topic;
                }
            },
            windowClass: "orgUserPicker-popup-modal"
        });
    };

    var createConference = function (ConferenceResource, TipsService, userId, currentCompanyCode, topic, conferenceName, conferenceType, result) {
        var memberList = [];
        var date = new Date();
        angular.forEach(topic.participants, function (participant) {
            var role;
            userId == participant.userId ? role = 2 : role = 1;
            if (participant.mobile) {
                memberList.push({
                    userId: participant.userId,
                    sex: participant.sex,
                    nickName: participant.userName,
                    loginName: participant.email.replace(/\@.*$/, ''),
                    number: participant.mobile,
                    role: role,
                    userPicId: participant.userPicId || participant.userPic
                });
            }
        });
        if (!conferenceType) {
            memberList.length == 2 ? conferenceType = 3 : conferenceType = 2;
        }
        // if (!conferenceName) {
        //     conferenceName = date.getFullYear().toString() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes();
        // }
        var createConferenceVo = {
            userId: userId,
            companyCode: currentCompanyCode,
            conferenceType: conferenceType,
            conferenceName: conferenceName,
            memberList: memberList
        };

        if ((conferenceType == 2 && result.confAuthority && result.confCallTime > 0) || (conferenceType == 3 && result.doubleAuthority && result.callTime > 0)) {
            ConferenceResource.createConferenceFromPc(createConferenceVo, TipsService);
            TipsService.show("系统正在拨号，请稍候...");
        } else {
            TipsService.show("通话时间不足或权限不足，请联系客服");
        }
    }

    conferenceService.$inject = deps;
    app.lazy.service("ConferenceService", conferenceService);
});
