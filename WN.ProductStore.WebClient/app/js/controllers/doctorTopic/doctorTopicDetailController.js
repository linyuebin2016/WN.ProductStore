define([
    'app',
    'resources/DoctorTopicResource',
    "services/BaseService",
    "filters/Moment",
    "directives/CommentForWx",
    "directives/AReward",
    'directives/UserImageForWx'
], function (app) {

    var deps = ['$scope', '$state', '$stateParams', 'DoctorTopicResource', "BaseService", 'UserService'];

    function controller($scope, $state, $stateParams, DoctorTopicResource, BaseService, UserService) {
        //contextType: 4：互助：求医问药；5、话题
        //detailType：0代表显示新发布的（非1和2）；1表示显示我发布的；2代表显示我回复
        $scope.contextType = $stateParams.contextType;
        $scope.detailType = $stateParams.detailType;
        $scope.enableadopt = false;
        //求医问药、话题 对应的 ID
        var topicId = $stateParams.topicId;
        var currentUser = UserService.getCurrentUser();

        $scope.topic = {};
        //获取明细数据
        DoctorTopicResource.getDiscussionDetailById(topicId).success(function (response) {
            //内容
            if (response.topicContent) {
                response.topicContent = response.topicContent.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
            }
            $scope.topic = response;
            if (!$scope.contextType) {
                $scope.contextType = $scope.topic.contextType;
            }
            if ($scope.topic.createUserId == currentUser.userId) {
                $scope.enableadopt = true;
            }
        });

        // 已采纳信息
        $scope.adoptItem = {};
        $scope.selectAdopt = function ($item) {
            $scope.adoptItem = $item;
        }
    }

    controller.$inject = deps;
    return app.lazy.controller('doctorTopicDetailController', controller);
});
