define([
    'app',
    "jquery",
    'resources/DoctorTopicResource',
    'directives/InfiniteScroll',
    "services/BaseService",
    "filters/Moment",
    'directives/UserImageForWx'
], function (app, $) {

    var deps = ['$scope', '$state', '$stateParams', 'DoctorTopicResource', "BaseService", '$cookieStore'];

    function controller($scope, $state, $stateParams, DoctorTopicResource, BaseService, $cookieStore) {
        // $scope.codeLogin().then(function () {
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.runInBrowser = runInBrowser();
        $scope.contextType = $stateParams.contextType;
        $scope.listType = 1;
        $scope.title = "我的";

        if ($scope.contextType == 5) {
            $scope.title = $scope.title + "话题";
        } else {
            $scope.title = $scope.title + "互助";
        }


        init();


        function init() {
            //init
            if ($stateParams.contextType == 4) {
                goDoctorTopic(4, 1);
            }
            if ($stateParams.contextType == 5) {
                goDoctorTopic(5, 1);
            }
        }


        function goDoctorTopic(contextType, listType) {
            $state.go("home.myDoctorTopicList.doctorTopicList", {
                contextType: contextType,
                listType: listType
            });
        };

        // $scope.setEssenceActive = function (id) {
        //     $("#contexttype4,#contexttype5,#contexttype6").removeClass("weui_bar_item_on");
        //     $('#' + id).addClass("weui_bar_item_on");
        // }




        //转到新发布，我发布的，我回复的
        $scope.gotoTopic = function gotoTopic(type) {
            // if (!$scope.contextType) {
            //     $scope.contextType = $cookieStore.get('doctorTopicListContextType');
            // }
            if (type == 1 || type == 2) {
                $state.go("home.myDoctorTopicList.doctorTopicList", {
                    contextType: $scope.contextType,
                    listType: type
                });
            }
        }

        // /**
        //  * 发表我的声音
        //  */
        // $scope.publishSuggestion = function () {
        //     $state.go("home.suggestionWrite", {
        //         orgId: null,
        //         orgName: null
        //     });
        // };

        //页签
        changeTab();

        function changeTab() {
            $(document).on("click", ".weui_navbar > a", function () {
                $(this).siblings("a").removeClass("weui_bar_item_on").end().addClass("weui_bar_item_on");
                var index = $(".weui_navbar > a").index($(this));
                if (index == 2) {
                    // $scope.contextType = 0;
                    $("#zhuanxie_btm").show();
                    $("#dtdiv45,#dtfoot45").hide();
                } else {
                    $("#zhuanxie_btm").hide();
                    $("#dtdiv45,#dtfoot45").show();
                    // if (index == 0) {
                    //     $scope.contextType = 4;
                    // } else if (index == 1) {
                    //     $scope.contextType = 5;
                    // }
                }
                $(".weui_tab_bd .weui_tab_bd_item").eq(index).siblings(".weui_tab_bd .weui_tab_bd_item").removeClass("weui_tab_bd_item_active").end().addClass("weui_tab_bd_item_active");
            });
        }
        // })
    }

    controller.$inject = deps;
    return app.lazy.controller('MyDoctorTopicListController', controller);
});