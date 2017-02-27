/**
 * Created by shengxiangyang on 2016-12-29.
 */
define(["app", "jquery",
    "jqueryWeUI",
    "resources/SuggestionResource",
    "filters/Moment"
], function (app, $) {

    var deps = ["$scope", "$stateParams", "SuggestionResource"];

    function controller($scope, $stateParams, SuggestionResource) {

        $scope.codeLogin().then(function () {
            $scope.basicSgtDetail = {};

            var topicId = $stateParams.topicId;

            $scope.reply = {
                contextId: topicId,
                replyContent: ""
            };

            /**
             * 获取基层声音明细
             * @param topicId
             */
            function queryItemById(topicId) {
                SuggestionResource.getSuggestionDetailById(topicId).success(function (resp) {
                    $scope.basicSgtDetail = resp;
                });
            }

            /**
             * 打开发送输入框
             */
            $scope.replay_btn = function () {
                $("#replyShuru").show();
            };

            /**
             * 回复基层声音
             */
            $scope.replyBasicSgt = function () {
                if ($scope.reply.replyContent == "" || $scope.reply.replyContent == null) {
                    $.toast("请输入回复内容", "forbidden");
                    return;
                }
                SuggestionResource.replyBasicSuggestion($scope.reply.contextId, $scope.reply.replyContent).success(function (resp) {
                    if (resp) {
                        $("#replyShuru").hide();
                        $.toast("已回复");
                        queryItemById(topicId);
                    }
                });
            };

            queryItemById(topicId);
        });
    }

    controller.$inject = deps;
    app.lazy.controller("SuggestionBasicDetailController", controller);
});