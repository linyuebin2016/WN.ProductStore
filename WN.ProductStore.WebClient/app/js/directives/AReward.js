/**
 * Created by shengxiangyang on 2017-01-09.
 * 移动端
 */
define(["app",
    "lodash",
    "jquery",
    "jqueryWeUI",
    "directives/UserImageForWx",
    "services/BaseService",
    "services/UserService",
    "resources/RewardResource"
], function (app) {

    var deps = ['$timeout', "$state", "BaseService", 'UserService', 'RewardResource'];

    function directive($timeout, $state, BaseService, UserService, RewardResource) {
        return {
            restrict: 'EA',
            templateUrl: "views/common/reward/a_reward.html",
            scope: {
                // 上下文对象ID
                contextId: "=contextId",
                // 上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：我的声音；7：好书榜；8：九三之声；
                contextType: "@",
                //被打赏人
                rewardUser: "=rewardUser"
            },
            link: function ($scope, element, attr) {

                var user = UserService.getCurrentUser();
                var userId = user.userId;
                var rewardUser = $scope.rewardUser;
                $scope.rewardVo = {
                    userId: user.userId,
                    userName: user.userName,
                    userPicId: user.userPicId,
                    rewardValue: 0,
                    rewardUserNameList:"",
                    rewardCount:0,
                    rewardUserCount:0
                };

                $scope.rewardUserPicList = [];

                getRewardCount($scope, RewardResource);
                loadData($scope, RewardResource);
                getRewardValue($scope, RewardResource);

                //随机金额
                $scope.randomAmount = function () {
                    getRewardValue($scope, RewardResource);
                };

                //弹出打赏框
                $scope.tc_reward = function () {
                    var contextType = parseInt($scope.contextType);
                    if (contextType == 3) {
                        if (rewardUser.length ==1){
                            if(userId == rewardUser[0]){
                                $.toast("不能给自己打赏!");
                                return true;
                            }
                        }
                        var flag = false;
                        if(rewardUser && rewardUser.length>0){
                            for(var i=0;i<rewardUser.length;i++){
                                if(userId == rewardUser[i]){
                                    flag = true;
                                }
                            }
                        }
                        if(flag){
                            $.toast("请注意，打赏只面向自己以外的负责人。");
                        }
                    } else {
                        if(rewardUser == userId) {
                            $.toast("不能给自己打赏。");
                            return true;
                        }
                    }
                    element.find(".weui_mask").addClass("weui_mask_visible");
                    element.find(".weui_dialog").addClass("weui_dialog_visible");
                };

                //关闭打赏框
                $scope.close = function () {
                    element.find(".weui_mask").removeClass("weui_mask_visible");
                    element.find(".weui_dialog").removeClass("weui_dialog_visible");
                };

                //打赏
                $scope.reward = function () {
                    $scope.rewardUserPicList = [];
                    $scope.rewardVo.rewardUserNameList = "";
                    var contextType = parseInt($scope.contextType);
                    var rewardValue = $scope.rewardVo.rewardValue.toString();
                    RewardResource.checkWdye(rewardValue).success(function (resp) {
                        if(resp) {
                            a_reward($scope,RewardResource,rewardValue,$timeout,element);
                        } else {
                            $.confirm("你的余额不足，请到钱包充值？", "确认充值", function () {
                                window.location.href = BaseService.webAppUrl + "html5/redpack/index.html#/myChange?userPicId=" + user.userPicId;
                            }, function () {
                                getRewardCount($scope, RewardResource);
                                loadData($scope, RewardResource);
                            });
                        }
                    });
                }
            }
        };
    }

    //获取打赏的人员记录
    function loadData($scope, RewardResource) {
        $scope.rewardUserPicList = [];
        $scope.rewardVo.rewardUserNameList = "";
        RewardResource.getRewardUserList($scope.contextId).success(function (resp) {
            if(resp && resp.length>0) {
                $scope.reward.rewardUserCount = resp.length;
                var length = resp.length;
                if (length>16){
                    for (var i=0;i<16;i++) {
                        $scope.rewardUserPicList.push(resp[i]);
                    }
                } else {
                    $scope.rewardUserPicList = resp;
                }
                if (length>2) {
                    length = 2;
                }
                if (length == 1){
                    $scope.rewardVo.rewardUserNameList += resp[0].userName;
                }else{
                    for (var j=0;j<length;j++) {
                        $scope.rewardVo.rewardUserNameList += resp[j].userName + "、";
                    }
                }
            }
        });
    }

    //获取打赏的数量
    function getRewardCount($scope, RewardResource) {
        RewardResource.getRewardCount($scope.contextId).success(function (resp) {
            if(resp) {
                $scope.rewardVo.rewardCount = resp;
            }
        });
    }

    //获取随机打赏的金额
    function getRewardValue($scope, RewardResource) {
        RewardResource.getRewardValue().success(function (resp) {
            if(resp) {
                $scope.rewardVo.rewardValue = resp;
            }
        });
    }

    //打赏
    function a_reward($scope,RewardResource,rewardValue,$timeout,element) {
        RewardResource.setRewardValue($scope.contextId, $scope.contextType, rewardValue).success(function (resp) {
            if(resp && resp.length>0) {
                var length = resp.length;
                if (length>16){
                    for (var i=0;i<16;i++) {
                        $scope.rewardUserPicList.push(resp[i]);
                    }
                } else {
                    $scope.rewardUserPicList = resp;
                }
                getRewardCount($scope, RewardResource);
                if (length>2) {
                    length = 2;
                }
                if (length == 1){
                    $scope.rewardVo.rewardUserNameList += resp[0].userName;
                }else{
                    for (var j=0;j<length;j++) {
                        $scope.rewardVo.rewardUserNameList += resp[j].userName + "、";
                    }
                }
                $.toast("打赏成功");
                $timeout(function () {
                    element.find(".weui_mask").removeClass("weui_mask_visible");
                    element.find(".weui_dialog").removeClass("weui_dialog_visible");
                }, 300);
            }
        });
    }

    directive.$inject = deps;
    return app.lazy.directive("fcAReward", directive);
});
