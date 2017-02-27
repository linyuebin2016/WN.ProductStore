/**
 * Created by zhuyunfeng on 2017/1/11.
 */
/**
 * Created by zhuyunfeng on 2017/1/11.
 */
define([
    'app',
    "jquery",
    'lodash',
    "jqueryWeUI",
    'resources/OperationalActivityResource',
    "services/BarcodeScannerService"
], function (app, $, _) {

    var deps = ['$scope', '$state', '$stateParams', 'OperationalActivityResource', 'BarcodeScannerService'];

    function controller($scope, $state, $stateParams, OperationalActivityResource, BarcodeScannerService) {
        /**返回 */
        $scope.goBack = function goBack() {
            window.history.back();
        }
        var drawId = $stateParams.drawId;
        $scope.directorState = $stateParams.directorState;
        $scope.drawPerson = [];

        //获取获奖人员信息
        function getDrawPerson() {
            return OperationalActivityResource.getDrawPersonList(drawId).success(function loaded(data) {
                $scope.drawPerson = data;
            });
        }

        getDrawPerson();

        // 扫码兑奖
        $scope.scan = function () {
            BarcodeScannerService.scan().then(
                function (result) {
                    var idGroup = result.split(",");
                    if (idGroup.length == 3) {
                        var activityId = idGroup[0];
                        var awardRound = parseInt(idGroup[1]);
                        var userId = idGroup[2];
                        if (drawId != activityId) {
                            $.toast("非本活动中奖名单!");
                            return;
                        }

                        $.confirm("确定为该社员兑奖？", "提示", function () {
                            OperationalActivityResource.exchangeAwardGift(activityId, awardRound, userId).success(function (data) {
                                if (data.status == 1) {
                                    var redeemUser = _.find($scope.drawPerson[awardRound - 1].awardUser, {"userId": userId});
                                    redeemUser.exchangeState = 2;

                                    $.toast("兑奖成功!");
                                } else {
                                    $.toast(data.errorMsg);
                                }
                            });
                        }, function () {
                            //取消操作
                        });
                    }
                    else {
                        $.toast("非兑奖二维码");
                    }
                },
                function (error) {
                    $.toast(error);
                }
            );
        }
    }

    controller.$inject = deps;
    return app.lazy.controller('DrawPersonListController', controller);
});

