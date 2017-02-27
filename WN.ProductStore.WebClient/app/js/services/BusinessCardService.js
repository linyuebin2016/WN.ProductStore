define([
    "app",
    "services/TipsService",
    "services/MessageBox",
    "services/UserService",
], function(app) {

	var deps = ["$http", "TipsService", "MessageBox", "$modal", "UserService"];

    var pickUser = function($modal) {
        return $modal.open({
            templateUrl: 'views/common/OrgUserPicker.html',
            controller: "OrgUserPickerController",
            backdrop: "static",
            keyboard: false,
            resolve: {
                type: function() {
                    return "user/group";
                },
                title: function() {
                    return "";
                },
                orgType: function() {
                    return 1;
                },
                singleOrg: function() {
                    return '';
                },
                singleUser: function() {
                    return false;
                }
            },
            windowClass: "orgUserPicker-popup-modal"
        });
    };

    var forwardBussNessMessage = function(attach, chosenList, loginUserid, callback) {
        if (!chosenList || chosenList.length == 0) {
            return; //取消
        }
        var userIds = [],
            groupIds = [],
            topicIds = [];
        for (var i = 0, len = chosenList.length; i < len; i++) {
            if (chosenList[i].userId) {
                if (chosenList[i].userId == loginUserid) {
                    continue
                }
                userIds.push(chosenList[i].userId); // 双人会话
            } else if (chosenList[i].topicId) {
                topicIds.push(chosenList[i].topicId); // 临时群组
            } else if (chosenList[i].groupId) {
                groupIds.push(chosenList[i].groupId); // 固定群组
            }
        }
        callback({
            channel: 'event.chat.msg',
            topic: 'forward',
            data: {
                userIds: userIds,
                groupIds: groupIds,
                topicIds: topicIds,
                message: attach,
                messageType: 10 //business card
            }
        });
    };

	function resource($http, TipsService, MessageBox, $modal, UserService) {
		return {
            shareBusinessCard: function(attach, callback) {
                pickUser($modal).result.then(function(data) {
                    var chosenList = [];
                    for (var i in data) {
                        chosenList.push(data[i]);
                    }
                    forwardBussNessMessage(attach, chosenList, UserService.getCurrentUser().userId, callback);
                });
            }
        };
	}

	resource.$inject = deps;
	app.lazy.factory("BusinessCardService", resource);
});
