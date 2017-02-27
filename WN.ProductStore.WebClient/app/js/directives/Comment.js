/**
 * Created by chenweizhi2 on 2016/12/21.
 * pc版
 */
define(["app",
    "lodash",
    "directives/InfiniteScroll",
    "filters/Moment",
    "services/MessageBox",
    "services/TipsService",
    "services/UserService",
    "resources/DiscussionResource",
    "resources/UserResource",
    'directives/user/UserImage',
    "directives/UserPanel"
], function (app) {

    var deps = ['$timeout', 'DiscussionResource', 'MessageBox', 'TipsService', 'UserService', 'UserResource'];

    function directive($timeout, DiscussionResource, MessageBox, TipsService, UserService, UserResource) {
        return {
            restrict: 'EA',
            templateUrl: "views/common/Comment.html",
            replace: true,
            scope: {
                // 上下文对象ID
                contextId: "=contextId",
                // 上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：我的声音；7：好书榜；8：九三之声；9：运营活动；
                contextType: "@",
                // 上下文（详情）创建人ID
                contextCreateUserId: "=?",
                // 是否启用采纳，1为启用，0为不启用（默认不启用）
                enableAdopt: "@?",
                // 是否仅查看，1为仅查看，0为可评论（默认不启用）
                enableReadonly: "@?",
                // 采纳成功执行回调,无参数
                onAdoptSuccess: "&?"
            },
            link: function ($scope, element, attr) {
                $scope.UserPanel = {visible: false, chat: null};

                $scope.enableAdopt = $scope.enableAdopt || 0;
                $scope.enableReadonly = $scope.enableReadonly || 0;

                var user = UserService.getCurrentUser();
                $scope.userId = user.userId;

                $scope.reply = {
                    UserId: null,
                    Placeholder: "",
                    Content: "",
                    ReplyContent: "",
                    Show: false
                };

                $scope.dataList = [];
                $scope.replyCount = 0;
                $scope.adoptState = false;
                var pageOption = {
                    pageNo: 1,
                    pageSize: 20,
                    isPaging: true
                };

                $scope.$watch("contextId", function () {
                    pageOption.pageNo = 1;
                    pageOption.isPaging = true;
                    loadData($scope, pageOption, DiscussionResource);
                });
                // loadData($scope, pageOption, DiscussionResource);

                $scope.scrollHandler = _scrollHandler;
                function _scrollHandler() {
                    loadData($scope, pageOption, DiscussionResource);
                }

                // 评论
                $scope.write = function () {
                    $scope.reply.UserId = null;
                    $scope.reply.Placeholder = "";
                    $scope.reply.ReplyContent = "";
                    $scope.reply.Show = true;
                    //等待$digest完成
                    $timeout(function () {
                        element.find("input.list-cell-bd").focus();
                    }, 300);
                }
                // 回复
                $scope.reply = function (userId, userName, replyContent) {
                    $scope.reply.UserId = userId;
                    $scope.reply.Placeholder = "回复 " + userName + "：";
                    $scope.reply.ReplyContent = replyContent;
                    $scope.reply.Show = true;
                    //等待$digest完成
                    $timeout(function () {
                        element.find("input.list-cell-bd").focus();
                    }, 300);
                }
                // 发送
                $scope.send = function () {
                    if (!$scope.reply.Content) {
                        TipsService.show("请录入评论内容");
                        return;
                    }

                    var commentVo = {
                        contextId: $scope.contextId,
                        contextType: $scope.contextType,
                        commentContent: $scope.reply.Content,
                        replyUserId: $scope.reply.UserId,
                        replyContent: $scope.reply.ReplyContent,
                        contextCreateUserId: $scope.contextCreateUserId
                    };
                    DiscussionResource.saveDiscussionReply(commentVo).success(function (data) {
                        if ($scope.dataList.length == 0) {
                            $scope.dataList.push(data);
                        }
                        else {
                            $scope.dataList.splice(0, 0, data);
                        }
                        $scope.reply.UserId = null;
                        $scope.reply.Placeholder = "";
                        $scope.reply.Content = "";
                        $scope.reply.Show = false;

                        $scope.replyCount++;
                        TipsService.show("发送成功");
                        try {
                            // 评论的埋点红包
                            UserResource.queryUserToReceiveRedPack({
                                contextTypeValue: $scope.contextType
                            }, function (data) {
                                if (data && data.length > 0) {
                                    $scope.$emit("receiveRedPack.HomeController", data);
                                }
                            })
                        } catch (e) {

                        }
                    });
                }
                // 显示采纳确认框
                var adoptOption = {
                    contextId: "",
                    topicItemId: ""
                };
                $scope.showAdoptModal = function (contextId, topicItemId) {
                    adoptOption.contextId = contextId;
                    adoptOption.topicItemId = topicItemId;
                }
                // 采纳
                $scope.adopt = function () {
                    DiscussionResource.setDiscussionMutualAdopt(adoptOption.contextId, adoptOption.topicItemId).success(function (data) {
                        if (data) {
                            var obj = _.find($scope.dataList, {topicItemId: adoptOption.topicItemId});
                            obj.adoptState = true;
                            $scope.adoptState = true;

                            // 清除采纳
                            _.remove($scope.dataList, {topicItemId: topicItemId});

                            // 执行回调
                            if ($scope.onAdoptSuccess) {
                                $scope.onAdoptSuccess({"$item": obj});
                            }

                            TipsService.show("采纳成功");
                        }
                        else {
                            TipsService.show("采纳失败");
                        }
                    });
                }
                //删除评论
                $scope.delete = function (topicItemId) {
                    var dialog = MessageBox.confirm("确定删除评论？");
                    dialog.result.then(function () {
                        DiscussionResource.setDiscussionReplyState(topicItemId).success(function (data) {
                            if (data) {
                                var obj = _.find($scope.dataList, {topicItemId: topicItemId});
                                obj.showStatus = 1;
                                TipsService.show("删除成功");
                            }
                            else {
                                TipsService.show("删除失败");
                            }
                        });
                    });
                }
            }
        };
    }

    function loadData($scope, pageOption, DiscussionResource) {
        DiscussionResource.getDiscussionReplyList($scope.contextId, $scope.contextType, pageOption.pageNo, pageOption.pageSize).success(function (data) {
            $scope.replyCount = data.replyCount;
            $scope.adoptState = data.adoptState;
            if (pageOption.isPaging && pageOption.pageNo === 1) {
                if (data.replyItem) {
                    $scope.dataList = data.replyItem;
                }
                else {
                    $scope.dataList = [];
                }
                if (data.adoptReply) {
                    // 采纳
                    if ($scope.onAdoptSuccess) {
                        $scope.onAdoptSuccess({"$item": data.adoptReply});
                    }
                    // if ($scope.dataList.length == 0) {
                    //     $scope.dataList.push(data.adoptReply);
                    // }
                    // else {
                    //     $scope.dataList.splice(0, 0, data.adoptReply);
                    // }
                }
            }
            else if (pageOption.isPaging) {
                $scope.dataList = $scope.dataList.concat(data.replyItem);
            }
            if (data.replyItem && data.replyItem.length == pageOption.pageSize) {
                pageOption.pageNo++;
                pageOption.isPaging = true;
            }
            else {
                pageOption.isPaging = false;
            }
        });
    }

    directive.$inject = deps;
    return app.lazy.directive("fcComment", directive);
});
