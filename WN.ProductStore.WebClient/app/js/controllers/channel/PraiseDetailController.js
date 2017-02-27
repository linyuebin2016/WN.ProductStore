define(["app",
    "directives/Loading",
    'directives/AdaptiveHeight',
    'resources/ChannelResource',
    'directives/InfiniteScroll'
], function (app, $, node, _) {

    "use strict";

    var deps = ["$scope", "$state", "$stateParams", "BaseService", 'ChannelResource'];

    function controller($scope, $state, $stateParams, BaseService,  ChannelResource) {
    
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.items = $stateParams.item;
    }

    controller.$inject = deps;
    app.lazy.controller("PraiseDetailController", controller);
});