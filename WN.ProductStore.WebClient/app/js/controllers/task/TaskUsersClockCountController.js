/**
 * Created by shengxiangyang on 2016-12-14.
 */
define([
    'app',
    "jquery",
    'lodash',
    "resources/TaskResource"
], function (app, $, _) {
    var deps = ['$scope', '$state', '$stateParams', 'TaskResource'];

    function controller($scope, $state, $stateParams, TaskResource){

        $scope.userClock = {};
        var taskId = $stateParams.taskId;

        function getUserClock() {
            TaskResource.getTaskClockUser(taskId).success(function loaded(data) {
                $scope.userClock = data;
            });
        }
        getUserClock();
    }

    controller.$inject = deps;
    return app.lazy.controller('TaskUsersClockController', controller);
});