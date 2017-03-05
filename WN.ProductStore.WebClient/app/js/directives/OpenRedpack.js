define(["app",
    "jquery",
    "services/BaseService",
    "services/AudioService",
    "services/SessionStorageService",
    "resources/RedPackageResource"
], function(app, $) {

    var deps = ["$rootScope", "$timeout", "RedPackageResource", "BaseService", "AudioService", "SessionStorageService"];

    function directive($rootScope, $timeout, RedPackageResource, BaseService, AudioService, SessionStorageService) {
        return {
            templateUrl: "views/common/loading/OpenRedpack.html",
            replace: true,
            scope: true,
            link: function($scope, elem) {

                var packIds;

                $scope.imgUrl = BaseService.restfulUrl + "fileUploadController/showPic/";

                $rootScope.$bus.subscribe({
                    channel: 'receive.redpack',
                    topic: 'RedPack',
                    callback: function(data) {
                        if (!data) {
                            return
                        }
                        $timeout(function() {
                            packIds = data;
                            $scope.showredpack = true;
                            $scope.getRedpackInfo();
                        }, 0)
                    }
                });

                $scope.getRedpackInfo = function() {
                    RedPackageResource.getPack(packIds[0]).success(function(data) {
                        $scope.currentRedpack = data;
                        if ($scope.currentRedpack.name && $scope.currentRedpack.name.length > 15) {
                            $scope.currentRedpack.name = $scope.currentRedpack.name.substr(0, 15) + "...";
                        }
                    })
                }

                $scope.openRedpack = function() {
                    var packId = packIds[0];
                    if (packId) {
                        AudioService.showCoinAudio();
                        $timeout(function() {
                            RedPackageResource.snatchPack(packId).success(function(data) {
                                $scope.currentRedpack.code = data.code;
                                if (data && data.code === 1) {
                                    $scope.currentRedpack.result = data.result;
                                } else {
                                    $scope.currentRedpack.result = "手慢了，红包被抢光了";
                                }
                            })
                        }, 0);
                        $(".weui-dialog-hb").addClass("weui-dialog-hb-kai");
                        $(".weui_dialog_bd_a").hide();
                        $(".weui_dialog_bd_b").show();
                        $(".p-yuan").show();
                    } else {
                        $scope.close();
                    }
                }

                $scope.close = function() {
                    packIds.splice(0, 1);
                    if (packIds.length > 0) {
                        redpackInit();
                        $scope.getRedpackInfo();
                    } else {
                        $scope.showredpack = false;
                        $timeout(function() {
                            redpackInit();
                            packId = null;
                        }, 100);
                    }
                }

                function redpackInit() {
                    $(".weui-dialog-hb").removeClass("weui-dialog-hb-kai");
                    $(".weui_dialog_bd_a").show();
                    $(".weui_dialog_bd_b").hide();
                    $(".p-yuan").hide();
                }

                $scope.seeMore = function(){
                    var packId = packIds[0];
                    $scope.loginUser = SessionStorageService.getItem("user");
                    var url = BaseService.webAppUrl + "html5/redpack/index.html#/redEnvelopsResult?packId=" + packId + "&userId=" + $scope.loginUser.userId
                    console.log(url);
                    window.location.href = url;
                }
            }
        };
    }

    directive.$inject = deps;
    return app.lazy.directive("fcOpenRedpack", directive);
});
