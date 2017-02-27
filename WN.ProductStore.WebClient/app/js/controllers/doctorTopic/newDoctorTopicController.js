define([
    'app',
    "jquery",
    "jqueryWeUI",
    'resources/DoctorTopicResource'
], function (app, $) {

    var deps = ['$scope', '$state', '$stateParams', 'DoctorTopicResource'];

    function controller($scope, $state, $stateParams, DoctorTopicResource) {
        //4：互助：求医问药；5、话题
        var contextType = parseInt($stateParams.contextType);
        if (contextType == 5) {
            $scope.typeName = "话题";
        } else {
            contextType = 4;
            $scope.typeName = "互助";
        }

        $scope.topic = {contextType: contextType};
        $scope.maxIntegral = 0;
        if (contextType == 4) {
            DoctorTopicResource.getUserAvailableIntegral().success(function (resp) {
                $scope.maxIntegral = resp;
            });
        }

        $scope.saveTopic = function saveTopic() {
            if (!$scope.topic.topicTitle) {
                $.toast("请输入标题!", "text");
                return;
            }
            if (contextType == 4) {
                if (!$scope.topic.integral || !($scope.topic.integral >= 0)) {
                    $.toast("请输入奖励积分!", "text");
                    return;
                }
                if ($scope.topic.integral > $scope.maxIntegral) {
                    $.toast("奖励积分不能超可用积分!", "text");
                    return;
                }
            }
            if (!$scope.topic.topicContent) {
                $.toast("请输入内容!", "text");
                return;
            }

            $.confirm("", "发布后不能修改，确认发布？", function () {
                DoctorTopicResource.saveDiscussionInfo($scope.topic).success(function (resp) {
                    $.toast("发布成功!");
                    //转到列表
                    $state.go("home.doctorTopicList", {contextType: contextType, listType: 1});
                });
            }, function () {
                //取消操作
            });
        }

        $scope.goBack=function goBack(){
              $state.go("home.communication");
        }

    }

    controller.$inject = deps;
    return app.lazy.controller('newDoctorTopicController', controller);
});
