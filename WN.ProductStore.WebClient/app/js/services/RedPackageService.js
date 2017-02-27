/**
 * Created by xiangshang on 2017-1-8
 */
define([
    "app",
    "services/BaseService",
    "services/NativeService",
    "services/UserService",
    "services/TipsService",
    "resources/RedPackageResource",
    "resources/ChatResource",
    "controllers/common/openRedPackageController"
], function(app, $) {

    var deps = ["$rootScope", "$modal", "BaseService", "NativeService", "UserService", "RedPackageResource", "ChatResource", "TipsService"];

    function service($rootScope, $modal, BaseService, NativeService, UserService, RedPackageResource, ChatResource, TipsService) {

        var loginUser = UserService.getCurrentUser();

        function openRedpackWindow() {
            var redPackageWin = NativeService.openWindow("./views/redpack/redpackBox.html", {
                "toolbar": false,
                "frame": false,
                "width": 500,
                "height": 600,
                "min_width": 500,
                "min_height": 600,
                "max_width": 500,
                "max_height": 600,
                "resizable": false,
                "new_instance": false
            });
            return redPackageWin;
        }

        function sendRedPack(userIds) {
            var redPackageUrl = BaseService.redPackageUrl + "sendSingleRedEnvelope";
            var redPackageWin = openRedpackWindow();
            redPackageWin.once('loaded', function() {
                var appElement = redPackageWin.window;
                appElement.init(redPackageUrl, "发红包");
                appElement.onCloseHandle = function(redPackageVo) {
                    if (redPackageVo && redPackageVo.type) {
                        // 发送红包
                        var redPackVo = {
                            createdBy: {
                                userId: loginUser.userId,
                                userName: loginUser.userName,
                                userPicId: loginUser.userPicId
                            },
                            name: redPackageVo.title, //红包名称
                            amount: redPackageVo.allAmount, //红包金额
                            totalNum: redPackageVo.totalNum, //红包数量
                            audiences: userIds,
                            contentType: 0, // 0 : 个人红包 1：组织红包 2：栏目红包
                            type: redPackageVo.type //红包类型(LUCK-拼手气，NORMAL-普通红包)
                        }
                        RedPackageResource.createPack(redPackVo).success(function(data){
                            if (data.returnStatus == 1) {
                                TipsService.show("红包发送成功");
                            } else {
                                TipsService.show(data.errorMsg);
                            }
                        });
                    }
                }
            });
        }

        function getUnGainUserPack(){
            return RedPackageResource.getUserPack(loginUser.currentCompanyCode, "unGain", null, "LT", 50);
        }

        function getPack(packId) {
            var redPackageUrl = BaseService.redPackageUrl + "redEnvelopsResult?packId=" + packId + "&userId=" + loginUser.userId;
            var redpackDetailUrl = BaseService.redPackageUrl + "redEnvelopsDetail?currentCompanyCode=" + loginUser.currentCompanyCode;
            var redPackageWin = openRedpackWindow();
            redPackageWin.once('loaded', function() {
                var appElement = redPackageWin.window;
                var init = function() {
                    appElement.init(redPackageUrl, "红包详情", {
                        name: "我的红包",
                        callback: function() {
                            appElement.init(redpackDetailUrl, "红包详情", {
                                name: "返回上级",
                                callback: init
                            })
                        }
                    });
                }
                init();
            });
        }

        function snatchPack(packId, callback) {
            RedPackageResource.snatchPack(packId).success(function(data) {
                /*code:-1,message:红包已被抢完
                 code:-2,message:用户已抢过红包
                 code:-3,message:用户违规已经被屏蔽
                 code:1,result:红包金额*/
                if (data && data.code === 1) {
                    $modal.open({
                        templateUrl: 'views/redpack/openRedPackage.html',
                        controller: "openRedPackageController",
                        backdrop: "static",
                        keyboard: true,
                        resolve: {
                            data: function() {
                                return packId;
                            },
                            result: function() {
                                return data.result;
                            }
                        },
                        windowClass: "redpackage-popup-modal"
                    }).result.then(function(data) {
                        callback();
                    });
                } else {
                    callback();
                }
            })
        }

        return {
            sendRedPack: sendRedPack,
            snatchPack: snatchPack,
            getPack: getPack,
            getUnGainUserPack: getUnGainUserPack
        }
    }

    service.$inject = deps;
    app.lazy.service("RedPackageService", service);
});
