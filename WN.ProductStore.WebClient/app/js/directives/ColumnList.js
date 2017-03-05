/**
 * Created by qiushaohua on 14-12-19.
 */
define([
    'app',
    'lodash',
    'jquery'
], function (app, _, $) {

    var deps = [ '$parse', '$timeout', '$interval' ];

    function directive($parse, $timeout, $interval) {
        return {
            templateUrl: 'views/common/columnlist/ColumnList.html',
            replace: true,
            transclude: true,
            scope: {
                list: '=fcColumnList',
                columnCount: '@',
                columnClass: '@',
                elemKey: '@'
            },
            link: function ($scope, elem, attrs) {

                var columnCount = parseInt($scope.columnCount);
                $scope.cols = _.range(columnCount);

                $scope.shortFirst = $parse(attrs.shortFirst)() || false;

                var $cols;

                function getCols() {
                    if (!$cols) {
                        $cols = elem.find('.js-col');
                    }
                    return $cols;
                }

                if ($scope.columnClass) {
                    $timeout(function() {
                        getCols().addClass($scope.columnClass);
                    }, 0);
                }

                if ($scope.shortFirst) {
                    $scope.columns = [];

                    var added = {};

                    function calcColumnHeight(index, col) {
                        $scope.columns[index] = $scope.columns[index] || {
                            list: []
                        };

                        $scope.columns[index].height = $(col).height();
                    }

                    function minColumnCondition(column) {
                        return column.height;
                    }

                    function addToShort(data) {
                        var key = data[$scope.elemKey];

                        if (added[key]) {
                            return;
                        }

                        getCols().each(calcColumnHeight);
                        var minCol = _.min($scope.columns, minColumnCondition);

                        minCol.list.push(data);
                        added[key] = 1;
                    }

                    function first(list) {
                        var data;
                        while (list && list.length > 0) {
                            data = list.shift();

                            var key = data[$scope.elemKey];

                            if (!added[key]) {
                                return data;
                            }
                        }
                        return null;
                    }

                    function cancelInterval() {
                        if ($scope.update) {
                            $interval.cancel($scope.update);
                            $scope.update = null;
                        }
                    }

                    function split(list) {
                        if (!list) {
                            return;
                        }

                        cancelInterval();

                        $scope.update = $interval(function() {
                            // remove the first element.
                            var firstElem = first(list);
                            if (firstElem) {
                                // if exist, add to shortest column
                                addToShort(firstElem);
                            } else {
                                list = null;
                                cancelInterval();
                            }
                        }, 50);
                    }

                    function resetColumnData(column) {
                        column.list = [];
                    }

                    function reset() {
                        if ($scope.columns) {
                            _.forEach($scope.columns, resetColumnData);
                        }
                        added = {};
                    }

                    $scope.$watch('list', reset);

                    $scope.$watchCollection('list', function listElemWatcher(list) {
                        if ($scope.update) {
                            // 还在渲染中, 数据发送变化了. 不知是多了还是少了, 直接reset 吧.
                            cancelInterval();
                            reset();
                        }
                        if (_.size(added) > _.size(list)) {
                            // 数据少了, 被删除了一些了. 直接重设重新排列
                            reset();
                        }
                        split(_.clone(list));
                    });
                }
            }
        };
    }

    directive.$inject = deps;
    return app.lazy.directive('fcColumnList', directive);
});