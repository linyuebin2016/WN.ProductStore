/**
 * Created by shengxiangyang on 2016-12-22.
 */
define(["app", "jquery",
    "jqueryWeUI",
    "resources/SuggestionResource"
], function (app, $) {

    var deps = ["$scope", "$state", "$stateParams", "SuggestionResource", "$cookieStore"];

    function controller($scope, $state, $stateParams, SuggestionResource, $cookieStore) {

        document.getElementById('confirm_button').disabled = false;
        $scope.zzName = "请选择发送组织";
        $scope.publishVo = {
            //声音标题
            topicTitle: "",
            //声音内容
            topicContent: "",
            //类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：声音：学员之声；
            contextType: 6,
            //声音是否匿名：true为匿名，false为不匿名
            anonymous: false,
            //发送的组织ID
            orgId: "",
            //发送组织名称
            orgName: ""
        };

        var orgId = $stateParams.orgId;
        var orgName = $stateParams.orgName;
        if (orgId && orgId != null && orgId != "") {
            $scope.zzName = orgName;
            $scope.publishVo.orgId = orgId;
            $scope.publishVo.orgName = orgName;
        }

        if ($cookieStore.get("topicTitle")) {
            $scope.publishVo.topicTitle = $cookieStore.get("topicTitle");
        }
        if ($cookieStore.get("anonymous")) {
            if ($cookieStore.get("anonymous") == "no") {
                $scope.publishVo.anonymous = false;
            }
            if ($cookieStore.get("anonymous") == "yes") {
                $scope.publishVo.anonymous = true;
            }
        }
        if ($cookieStore.get("topicContent")) {
            $scope.publishVo.topicContent = $cookieStore.get("topicContent");
        }

        //跳转发送组织搜索页面
        $scope.getSendOrg = function () {
            $cookieStore.put("topicTitle", $scope.publishVo.topicTitle);
            $cookieStore.put("topicContent", $scope.publishVo.topicContent);
            $state.go("home.suggestionSearchOrg");
        };

        function check() {
            if (!$scope.publishVo.topicTitle) {
                $.toast('请输入标题!', "forbidden");
                return false;
            }
            if (!$scope.publishVo.orgName) {
                $.toast('请输入要发送的组织!', "forbidden");
                return false;
            }
            if (!$scope.publishVo.topicContent) {
                $.toast('请输入内容!', "forbidden");
                return false;
            }
            return true;
        }

        $scope.checkAnony = function () {
            if ($scope.publishVo.anonymous) {
                $cookieStore.put("anonymous", "yes");
            } else {
                $cookieStore.put("anonymous", "no");
            }
        };

        /**
         * 发表我的声音
         */
        $scope.pubSuggestion = function () {
            if (!check()) {
                return;
            }
            SuggestionResource.saveMySuggestion($scope.publishVo).success(function (resp) {
                if (resp) {
                    $.toast("发表成功");
                    $cookieStore.remove("topicTitle");
                    $cookieStore.remove("anonymous");
                    $cookieStore.remove("topicContent");
                    document.getElementById('confirm_button').disabled = true;
                    $state.go("home.communication.suggestionList", {
                        contextType: 6,
                        listType: 0
                    });
                } else {
                    $.toast("发表失败");
                }
            })
        };
    }

    controller.$inject = deps;
    app.lazy.controller("SuggestionWriteController", controller);
});
