define([ "app", "angular", "jquery" ], function (app, angular, $) {

    var errorDeps = ['$scope', '$modalInstance', 'config'];

    function error($scope, $modalInstance, config) {
        $scope.config = $.extend({
            msg: '发生未知错误',
            header: '提示', //错误
            button: '关闭'
        }, config);

        $scope.close = function () {
            $modalInstance.close();
        };
    }

    var confirmDeps = ['$scope', '$modalInstance', 'config'];

    function confirm($scope, $modalInstance, config) {
        $scope.config = $.extend({
            msg: '确认',
            header: '提示', //确认
            yesButton: '确定',
            noButton: '取消'
        }, config);

        $scope.no = function () {
            $modalInstance.dismiss('no');
        };

        $scope.yes = function () {
            $modalInstance.close('yes');
        };
    }

    var confirmResultDeps = ['$scope', '$modalInstance', 'config'];

    function confirmResult($scope, $modalInstance, config) {
        $scope.config = $.extend({
            msg: '确认',
            header: '提示', //确认
            yesButton: '确定',
            noButton: '取消'
        }, config);

        $scope.no = function () {
            $modalInstance.close('no');
        };

        $scope.yes = function () {
            $modalInstance.close('yes');
        };
    }

    var notifyDeps = ['$scope', '$timeout', '$modalInstance', 'config'];

    function notify($scope, $timeout, $modalInstance, config) {
        $scope.config = $.extend({
            msg: '提醒',
            header: '提示', //提醒
            button: '关闭',
            displayTime: 2000
        }, config);

        $scope.close = function () {
            $modalInstance.dismiss('no');
        };

        $modalInstance.result.then(function () {
        }, function () {
            // dismiss 方法, 产生reject 的result. 因此在这里, 取消延时关闭(如果还有的话), 避免出现错误.
            if (closePromise) {
                $timeout.cancel(closePromise);
            }
        });

        var closePromise = $timeout(function () {
            $scope.close();
        }, $scope.config.displayTime);
    }

    error.$inject = errorDeps;
    app.lazy.controller('ErrorDialog', error);

    confirmResult.$inject = confirmResultDeps;
    app.lazy.controller('ConfirmResultDialog', confirmResult);

    confirm.$inject = confirmDeps;
    app.lazy.controller('ConfirmDialog', confirm);

    notify.$inject = notifyDeps;
    app.lazy.controller('NotifyDialog', notify);

    var deps = ["$modal"];

    function messageBox($modal) {
        return {
            error: function (config) {
                return $modal.open({
                    templateUrl: 'views/common/messagebox/error.html',
                    controller: 'ErrorDialog',
                    resolve: {
                        config: function () {
                            return parseArgument(config);
                        }
                    }
                });
            },

            confirm: function (config) {
                return $modal.open({
                    templateUrl: 'views/common/messagebox/confirm.html',
                    controller: 'ConfirmDialog',
                    resolve: {
                        config: function () {
                            return parseArgument(config);
                        }
                    }
                });
            },

            confirmResult: function (config) {
                return $modal.open({
                    templateUrl: 'views/common/messagebox/confirm.html',
                    controller: 'ConfirmResultDialog',
                    resolve: {
                        config: function () {
                            return parseArgument(config);
                        }
                    }
                });
            },

            notify: function (config) {
                return $modal.open({
                    templateUrl: 'views/common/messagebox/notify.html',
                    controller: 'NotifyDialog',
                    resolve: {
                        config: function () {
                            return parseArgument(config);
                        }
                    }
                });
            }
        };
    }

    /**
     * 解析参数, 如果参数是对象, 则直接使用, 如果参数是字符串, 则当做msg 来处理
     * @param config
     * @returns {*}
     */
    function parseArgument(config) {
        if (angular.isObject(config)) {
            return angular.copy(config);
        }
        return {
            msg: arguments[0]
        }
    }

    messageBox.$inject = deps;
    return app.lazy.factory('MessageBox', messageBox);
});
