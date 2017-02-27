define(["app",
    "services/BaseService",
    'resources/NoticeResource',
    "directives/NoticeHtml"
], function (app) {

    "use strict";

    var deps = ["$scope", "$state", 'NoticeResource', 'BaseService'];

    function controller($scope, $state, NoticeResource, BaseService) {
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.runInBrowser = runInBrowser();

        //得到通知类型列表
        NoticeResource.queryCategoryNoticeInfo().success(function (result) {
            $scope.noticeTypeList = result;
        })

        $scope.goToNoticeItem = function (categoryId, categoryName) {
            $state.go("home.noticeItem", {categoryId: categoryId, categoryName: categoryName})
        }

    }

    controller.$inject = deps;
    app.lazy.controller("NoticeController", controller);
});
