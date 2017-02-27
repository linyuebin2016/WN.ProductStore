define(["app",
    "jquery",
    "services/BaseService",
    "services/SessionStorageService",
    "directives/BoookHome"
], function (app, $) {

    "use strict";

    var deps = ["$scope", "$state", "$stateParams", "BaseService", 'SessionStorageService', '$cookieStore'];
    var config;

    function controller($scope, $state, $stateParams, BaseService, SessionStorageService, $cookieStore) {

        // $scope.codeLogin().then(function () {
            $scope.baseUrl = BaseService.restfulUrl;
            $scope.runInBrowser = runInBrowser();
            $scope.currentUser = SessionStorageService.getItem("user");

            $scope.setEssenceActive = function (id) {
                $("#contexttype4,#contexttype5,#contexttype6").removeClass("weui_bar_item_on");
                $('#' + id).addClass("weui_bar_item_on");
            }

            $scope.goDoctorTopic = function (contextType, listType) {
                $state.go("home.communication.doctorTopicList", {contextType: contextType, listType: listType});
            };
            // 缺省显示求医问药
            // if ($stateParams.contextType == undefined) {
            //     $scope.contextType = 4;
            //     $scope.goDoctorTopic(4, 0);
            // }

            //转到新发布，我发布的，我回复的
            $scope.gotoTopic = function gotoTopic(type) {
                if (!$scope.contextType) {
                    $scope.contextType = $cookieStore.get('doctorTopicListContextType');
                }
                if (type == 0) {
                    $state.go("home.newDoctorTopic", {contextType: $scope.contextType});
                } else if (type == 1 || type == 2) {
                    $state.go("home.doctorTopicList", {contextType: $scope.contextType, listType: type});
                }
            }

            /**
             * 发表我的声音
             */
            $scope.publishSuggestion = function () {
                $state.go("home.suggestionWrite", {
                    orgId: null,
                    orgName: null
                });
            };

            //页签
            changeTab();
            function changeTab() {
                $(document).on("click", ".weui_navbar > a", function () {
                    $(this).siblings("a").removeClass("weui_bar_item_on").end().addClass("weui_bar_item_on");
                    var index = $(".weui_navbar > a").index($(this));
                    if (index == 2) {
                        $scope.contextType = 0;
                        $("#zhuanxie_btm").show();
                        $("#dtdiv45,#dtfoot45").hide();
                    } else {
                        $("#zhuanxie_btm").hide();
                        $("#dtdiv45,#dtfoot45").show();
                        if (index == 0) {
                            $scope.contextType = 4;
                        } else if (index == 1) {
                            $scope.contextType = 5;
                        }
                    }
                    $(".weui_tab_bd .weui_tab_bd_item").eq(index).siblings(".weui_tab_bd .weui_tab_bd_item").removeClass("weui_tab_bd_item_active").end().addClass("weui_tab_bd_item_active");
                });
            }
        // })

    }

    controller.$inject = deps;
    app.lazy.controller("CommunicationController", controller);
});