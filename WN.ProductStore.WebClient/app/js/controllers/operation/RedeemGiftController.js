/**
 * Created by chenweizhi2 on 2017/1/17.
 */
define(["app",
    "jquery",
    "jqueryWeUI",
    "jqueryQrcode",
    "resources/OperationalActivityResource",
    "services/BaseService",
    "services/UserService"
], function (app) {

    var deps = ['$scope', '$stateParams', '$timeout', 'OperationalActivityResource', 'BaseService', 'UserService'];

    function controller($scope, $stateParams, $timeout, OperationalActivityResource, BaseService, UserService) {
        //微信登陆
        $scope.codeLogin().then(function () {

            // 详情Id,轮次
            var redeemId = $stateParams.redeemId;

            var activityId = redeemId.split(",")[0];
            var awardRound = redeemId.split(",")[1];

            $scope.$watch('$viewContentLoaded', function () {
                // 生成二维码
                var user = UserService.getCurrentUser();
                var qrcodeText = activityId + "," + awardRound + "," + user.userId;
                var options180 = {render: "canvas", text: qrcodeText, width: 180, height: 180};
                $("#qrcode180").qrcode(options180);
            });

            $scope.giftPicUrl = "";
            var giftPicUrl = BaseService.restfulUrl + "fileUploadController/showPic/";
            $scope.giftVo = {};

            init();
            function init() {
                OperationalActivityResource.getAwardGift(activityId, awardRound).success(function (data) {
                    if (data) {
                        $scope.giftVo = data;
                        $scope.giftPicUrl = giftPicUrl + data.giftPicId;
                        switch (data.exchangeState) {
                            case 0:
                                $(".cy-jiangping-boxA").show();
                                break;
                            case 1:
                                $(".cy-jiangping-boxB").show();
                                checkRedeem();
                                break;
                            case 2:
                                $(".cy-jiangping-boxC").show();
                                break;
                        }
                    }
                    else {
                        $.toast("该用户登录失败");
                    }
                });
            }

            $scope.redeem = function () {
                if ($scope.giftVo.exchangeState == 0) {
                    $.confirm("确定兑奖？", "提示", function () {
                        OperationalActivityResource.exchangeGift(activityId, awardRound).success(function (data) {
                            if (data.status == 1) {
                                $scope.giftVo.exchangeState = 1;
                                $scope.giftVo.userIntegral = $scope.giftVo.userIntegral - $scope.giftVo.giftIntegral;

                                $(".cy-jiangping-boxB").show();
                                $(".cy-jiangping-boxA").hide();
                                checkRedeem();
                            }
                            else {
                                $.toast(data.errorMsg);
                            }
                        });
                    }, function () {
                        //取消操作
                    });
                }
            }

            var timer = null;

            function checkRedeem() {
                timer = $timeout(function () {
                    OperationalActivityResource.getAwardGift(activityId, awardRound).success(function (data) {
                        if (data && data.exchangeState == 2) {
                            $(".cy-jiangping-boxC").show();
                            $(".cy-jiangping-boxB").hide();
                        }
                        else {
                            checkRedeem();
                        }
                    });
                }, 5000);
            }

            $scope.$on("$destroy", function () {
                if (timer) {
                    $timeout.cancel(timer);
                }
            });

        });
    }

    controller.$inject = deps;
    app.lazy.controller("RedeemGiftController", controller);
});