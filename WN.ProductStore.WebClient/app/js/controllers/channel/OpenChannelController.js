/**
 * Created by chenweizhi2 on 2016/11/24.
 */

define(["app",
    "jquery",
    "lodash",
    "angularSanitize",
    "uiSelect",
    "directives/user/UserPicSetting",
    'directives/AdaptiveHeight',
    "services/BaseService",
    "services/TipsService",
    "services/UserService",
    "resources/UserResource",
    "resources/OrgResource",
    "resources/ChannelResource"
], function (app) {
    var deps = ['$scope', '$window', '$timeout', '$stateParams', '$state', 'BaseService', 'TipsService', 'UserService', 'UserResource', 'OrgResource', 'ChannelResource'];

    function controller($scope, $window, $timeout, $stateParams, $state, BaseService, TipsService, UserService, UserResource, OrgResource, ChannelResource) {

        $scope.channelDetailVo = {};

        $scope.applyButton = {
            title: "申请开通",
            disable: false
        };

        // 该组织是否已开通资讯号
        $scope.existOrgChannel = false;

        $scope.applyForOpen = function () {
            $scope.channelDetailVo.applyOrgId = $scope.listSelected.value.orgId;
            $scope.channelDetailVo.groupName = $scope.listSelected.value.orgName;

            if ($scope.existOrgChannel) {
                TipsService.show("该组织已开通资讯号");
                return;
            }
            if (!$scope.channelDetailVo.picId) {
                TipsService.show("请上传logo");
                return;
            }
            if (!$scope.channelDetailVo.applyOrgId) {
                TipsService.show("请选择组织");
                return;
            }
            if (!$scope.channelDetailVo.validateCode) {
                TipsService.show("请输入手机短信收到的验证码");
                return;
            }

            $scope.applyButton.title = "提交中";
            $scope.applyButton.disable = true;
            ChannelResource.saveChannel($scope.channelDetailVo).success(function (data) {
                if (data.errorCode === 0) {
                    TipsService.show("您的申请已经发出，管理员审核后会发送通知，请注意查收。");
                    $state.go("home.channel.channelManage", {
                        channelId: data.groupId,
                        channelName: data.groupName,
                        manage: true
                    });
                    $scope.$parent.getManageChannelList();
                }
                else {
                    TipsService.show(data.errorMsg);
                }
                $scope.applyButton.title = "申请开通";
                $scope.applyButton.disable = false;
            })
        }

        /*LOGO*/
        $scope.showSetLogo = false;
        $scope.setLogo = function () {
            $scope.showSetLogo = true;
        }

        $scope.logoUrl = "";

        getLogoUrl();
        function getLogoUrl() {
            if ($scope.channelDetailVo && $scope.channelDetailVo.picId) {
                $scope.logoUrl = BaseService.restfulUrl + "fileUploadController/showPic/" + $scope.channelDetailVo.picId + "?picType=3"
                return;
            }

            $scope.logoUrl = "images/img-def.png";
        }

        /*图片保存后传递id*/
        $scope.$on("event.uploadtopicImage.done", function (event, data) {
            $scope.channelDetailVo.picId = data.fileId;
            getLogoUrl();
            $scope.showSetLogo = false;

            // 接收成功
            $scope.$emit("event.uploadtopicImage.success", data);
            // 停止传播
            event.stopPropagation();
        });

        /*组织查询列表*/
        $scope.orgList = [];
        $scope.refreshOrg = function (orgName) {
            if (orgName) {
                OrgResource.queryOrgsByName(orgName).success(function (data) {
                    $scope.orgList = data.orgList;
                });
            }
        }
        $scope.listSelected = {value: {}};
        // 检测当前组织是否已开通资讯号
        $scope.onSelectCallback = function ($item, $model) {
            ChannelResource.isExistOrgChannel($model.orgId).success(function (data) {
                if (data) {
                    $scope.existOrgChannel = true;
                }
                else {
                    $scope.existOrgChannel = false;
                }
            })
        }

        /*字数限制*/
        $scope.limitWordsCount = 140;
        $scope.currWordsCount = 0;
        $scope.checkText = function () {
            if ($scope.channelDetailVo.description.length > $scope.limitWordsCount) {
                $scope.channelDetailVo.description = $scope.channelDetailVo.description.substr(0, $scope.limitWordsCount);
            }
            $scope.currWordsCount = $scope.channelDetailVo.description.length;
        };

        /*手机验证码*/
        $scope.phoneVerifyCode = {
            title: "发送验证码",
            isSend: false,
            second: 60
        };

        $scope.getPhoneVerifyCode = function () {
            if (!$scope.channelDetailVo.mobile) {
                TipsService.show("请设置手机号码");
                return;
            }

            // 发送验证码
            UserResource.sendValidateCode({
                mobile: $scope.channelDetailVo.mobile
            }, function (result) {
                // result.status;
            })

            $scope.phoneVerifyCode.isSend = true;
            for (var i = 0; i <= $scope.phoneVerifyCode.second; i++) {
                (function (x) {
                    $timeout(function () {
                        $scope.phoneVerifyCode.title = ($scope.phoneVerifyCode.second - x) + "s";
                        if (x === $scope.phoneVerifyCode.second) {
                            $scope.phoneVerifyCode.title = "再次获取验证码";
                            $scope.phoneVerifyCode.isSend = false;
                        }
                    }, 1000 * x)
                })(i);
            }
        }

        initData();
        function initData() {
            var currUser = UserService.getCurrentUser()
            $scope.channelDetailVo = {
                picId: "",
                groupId: "",
                groupName: "",
                applyOrgId: "",
                createUserId: currUser.userId,
                createUserName: currUser.userName,
                description: "",
                mobile: currUser.mobile,
                validateCode: ""
            };

            if (currUser.userOrg && currUser.userOrg.length > 0) {
                $scope.listSelected.value.orgId = currUser.userOrg[0].orgId;
                $scope.listSelected.value.orgName = currUser.userOrg[0].orgName;

                $scope.onSelectCallback(null, $scope.listSelected.value);
            }
        }
    }

    controller.$inject = deps;
    return app.lazy.controller("OpenChannelController", controller);
});