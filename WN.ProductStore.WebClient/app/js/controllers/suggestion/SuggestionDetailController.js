/**
 * Created by shengxiangyang on 2016-12-22.
 */
define(["app",
    "resources/SuggestionResource",
    "filters/Moment"
], function (app) {

    var deps = ["$scope", "$stateParams", "SuggestionResource"];

    function controller($scope, $stateParams, SuggestionResource) {

        $scope.suggestionDetail = {};

        var topicId = $stateParams.topicId;

        /**
         * 获取我的声音明细
         * @param topicId
         */
        function queryItemById(topicId) {
            SuggestionResource.getSuggestionDetailById(topicId).success(function (resp) {
                $scope.suggestionDetail = resp;
            });
        }

        queryItemById(topicId);
    }

    controller.$inject = deps;
    app.lazy.controller("SuggestionDetailController", controller);
});
