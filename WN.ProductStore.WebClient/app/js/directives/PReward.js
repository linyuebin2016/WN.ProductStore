/**
 * Created by shengxiangyang on 2017-01-09.
 * PC端
 */
define(["app",
    "lodash",
    "directives/InfiniteScroll",
    "filters/Moment",
    "services/MessageBox",
    "services/TipsService",
    "services/UserService",
    "resources/RewardResource",
    'directives/user/UserImage',
    "directives/UserPanel"
], function (app) {

    var deps = ['$timeout', "$state", 'UserService', 'RewardResource', 'TipsService', 'MessageBox'];

    function directive($timeout, $state, UserService, RewardResource, TipsService, MessageBox) {
        return {
            restrict: 'EA',
            templateUrl: "views/common/reward/p_reward.html",
            scope: {
                // 上下文对象ID
                contextId: "=contextId",
                // 上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：我的声音；7：好书榜；8：九三之声；
                contextType: "@",
                //被打赏人
                rewardUser: "=rewardUser"
            },
            link: function ($scope, element, attr) {
                $scope.UserPanel={visible:false,chat:null};
                var user = UserService.getCurrentUser();
                var userId = user.userId;
                var rewardUser = $scope.rewardUser;
                $scope.rewardVo = {
                    markWord: "",
                    userId: user.userId,
                    userName: user.userName,
                    userPicId: user.userPicId,
                    rewardValue: 0,
                    rewardUserNameList:"",
                    rewardCount:0
                };

                //初始化提示语
                var contextType = parseInt($scope.contextType);
                if (contextType == 2) {
                    $scope.rewardVo.markWord = "文章很有趣，打个赏吧~";
                }
                if (contextType == 3) {
                    $scope.rewardVo.markWord = "负责人真辛苦，打个赏吧~";
                }
                if (contextType == 4) {
                    $scope.rewardVo.markWord = "回答真有意思，打个赏吧~";
                }
                if (contextType == 7) {
                    $scope.rewardVo.markWord = "推荐很辛苦，打个赏吧~";
                }
                if (contextType == 8) {
                    $scope.rewardVo.markWord = "听的津津有味，打个赏吧~";
                }

                $scope.rewardUserPicList = [];

                getRewardCount($scope, RewardResource);
                loadData($scope, RewardResource);
                getRewardValue($scope, RewardResource);

                //随机金额
                $scope.randomAmount = function () {
                    getRewardValue($scope, RewardResource);
                };

                //打赏
                $scope.reward = function () {
                    var rewardValue = $scope.rewardVo.rewardValue.toString();
                    $scope.rewardUserPicList = [];
                    $scope.rewardVo.rewardUserNameList = "";
                    checkYe($scope,RewardResource,rewardValue,MessageBox,TipsService,$timeout,$state);
                };

                $scope.check_reward = function () {
                    if (contextType == 3) {
                        if (rewardUser.length ==1){
                            if(userId == rewardUser[0]){
                                TipsService.show("不能给自己打赏。");
                                return true;
                            }
                        }
                        var flag = false;
                        if(rewardUser && rewardUser.length>0){
                            for(var j=0;j<rewardUser.length;j++){
                                if(userId == rewardUser[j]){
                                    flag = true;
                                }
                            }
                        }
                        if(flag){
                            TipsService.show("请注意，打赏只面向自己以外的负责人。");
                        }
                    } else {
                        if(rewardUser == userId) {
                            TipsService.show("不能给自己打赏。");
                            return true;
                        }
                    }
                    $('#cn-modal').modal('show');
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
                var length = resp.length;
                if (length>16){
                    for (var i=0;i<16;i++) {
                        $scope.rewardUserPicList.push(resp[i]);
                    }
                } else {
                    $scope.rewardUserPicList = resp;
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
    function reward($scope,RewardResource,rewardValue,TipsService,$timeout) {
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
                TipsService.show("打赏成功");
                $timeout(function () {
                    document.getElementById('close_button').click();
                }, 500);
            }
        });
    }

    //检查余额
    function checkYe($scope,RewardResource,rewardValue,MessageBox,TipsService,$timeout,$state) {
        RewardResource.checkWdye(rewardValue).success(function (data) {
            if(data) {
                reward($scope,RewardResource,rewardValue,TipsService,$timeout);
            } else {
                getRewardCount($scope, RewardResource);
                loadData($scope, RewardResource);
                var confirm = MessageBox.confirmResult("你的余额不足，请到钱包充值？");
                confirm.result.then(function (result) {
                    if (result === "yes") {
                        document.getElementById('close_button').click();
                        $timeout(function () {
                            $state.go("home.usersetting", {
                                flag: true
                            });
                        }, 500);
                    }
                });
            }
        });
    }

    directive.$inject = deps;
    return app.lazy.directive("fcPReward", directive);
});
