/**
 * Created by chenweizhi2 on 2016/12/13.
 */

define(["app",
    "jquery",
    "lodash",
    'services/UserService',
    'services/GeolocationService',
    'resources/TaskResource'
], function (app) {

    var deps = ['$scope', '$window', '$interval', '$timeout', '$stateParams', '$state', 'UserService', 'GeolocationService', 'TaskResource'];

    function controller($scope, $window, $interval, $timeout, $stateParams, $state, UserService, GeolocationService, TaskResource) {

        var taskId = $stateParams.taskId;

        $scope.ClockUserList = [];
        $scope.taskClockState = 0;
        $scope.isOther = false;
        $scope.stopwatch = {
            hour: 0,
            minute: 0,
            second: 0,
            hourText: "00",
            minuteText: "00",
            secondText: "00",
        };
        var user = UserService.getCurrentUser();

        $scope.$watch('stopwatch.hour', function () {
            $scope.stopwatch.hourText = (String($scope.stopwatch.hour).length == 1 ? '0' : '') + String($scope.stopwatch.hour);
        });
        $scope.$watch('stopwatch.minute', function () {
            $scope.stopwatch.minuteText = (String($scope.stopwatch.minute).length == 1 ? '0' : '') + String($scope.stopwatch.minute);
        });
        $scope.$watch('stopwatch.second', function () {
            $scope.stopwatch.secondText = (String($scope.stopwatch.second).length == 1 ? '0' : '') + String($scope.stopwatch.second);
        });

        $scope.error = {
            state: false,
            msg: "打卡失败，请确认您已到达现场"
        };
        $scope.loading = false;
        var timer = null;

        init();
        function init() {
            TaskResource.getSocialTaskClockUserList(taskId).success(function (data) {
                //当taskClockState为1的时候，才做判断：任务负责人设置当前状态：0为未开始打卡；1为开始打卡也就是打卡中；2为打卡结束
                $scope.taskClockState = data.taskClockState;
                if (data.taskClockUserId && user.userId != data.taskClockUserId) {
                    $scope.isOther = true;
                }
                if (data.taskClockUser) {
                    $scope.ClockUserList = data.taskClockUser;
                }
                if ($scope.taskClockState != 0) {
                    setTime(data.taskClockStartDate, data.taskClockFinishDate);
                    // 打卡中
                    if ($scope.taskClockState == 1) {
                        startStopwatch();
                    }
                }
            });
        }

        function setTime(startDate, finishDate) {
            var diffTime = (new Date(finishDate).getTime() - new Date(startDate).getTime()) / 1000;
            $scope.stopwatch.hour = parseInt(diffTime / 60 / 60);
            $scope.stopwatch.minute = parseInt(diffTime / 60 - $scope.stopwatch.hour * 60);
            $scope.stopwatch.second = parseInt(diffTime - $scope.stopwatch.hour * 60 * 60 - $scope.stopwatch.minute * 60);
        }

        //推送
        $scope.$bus.subscribe({
            channel: "websocket",
            topic: "signSocialTaskUser",
            callback: function onWsMessage(data) {
                //用户ID userId;
                //打卡人名称 userName;
                //打卡人组织 userOrgName;
                //打卡时间 userClockDate;
                //任务ID taskId;
                if (taskId == data.extras.taskId) {
                    var obj = _.find($scope.ClockUserList, {userId: data.extras.userId});
                    if (!obj) {
                        $scope.ClockUserList.splice(0, 0, data.extras);
                    }
                }
            }
        });

        $scope.$on("$destroy", function () {
            if (timer) {
                $interval.cancel(timer);
            }
        });

        $scope.start = function () {
            setClockState(1);
        }

        $scope.stop = function () {
            setClockState(2);
        }

        $scope.continue = function () {
            setClockState(1);
        }

        function startStopwatch() {
            timer = $interval(function () {
                $scope.stopwatch.second++;
                if ($scope.stopwatch.second >= 60) {
                    $scope.stopwatch.second = 0;
                    $scope.stopwatch.minute++;
                }
                if ($scope.stopwatch.minute >= 60) {
                    $scope.stopwatch.minute = 0;
                    $scope.stopwatch.hour++;
                }
            }, 1000);
        }

        function setClockState(taskClockState) {
            if (taskClockState == 1) {
                $scope.loading = true;
                GeolocationService.getCurrentPosition().then(function (location) {
                    TaskResource.setSocialTaskClockState(taskId, taskClockState, location.longitude, location.latitude).success(function (data) {
                        $scope.taskClockState = data.taskClockState;
                        if (data.taskClockUserId && user.userId != data.taskClockUserId) {
                            $scope.isOther = true;
                            setTime(data.taskClockStartDate, data.taskClockFinishDate);
                        }
                        startStopwatch();
                    });
                    $scope.error.state = false;
                    $scope.loading = false;
                }, function (error) {
                    $scope.error.state = true;
                    $scope.error.msg = error.errorMsg;
                    $scope.loading = false;
                });
            }
            else {
                TaskResource.setSocialTaskClockState(taskId, taskClockState, 0, 0).success(function (data) {
                    $scope.taskClockState = data.taskClockState;
                    if (timer) {
                        $interval.cancel(timer);
                    }
                });
            }
        }
    }

    controller.$inject = deps;
    app.lazy.controller("OpenClockController", controller);
});
