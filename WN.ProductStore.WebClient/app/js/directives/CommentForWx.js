/**
 * Created by chenweizhi2 on 2016/12/21.
 * 微信版
 */
define(["app",
    "lodash",
    "jquery",
    "jqueryWeUI",
    "directives/InfiniteScroll",
    "directives/UserImageForWx",
    "filters/Moment",
    "services/UserService",
    "resources/DiscussionResource",
    "resources/UserResource",

    "resources/CollectListResource",
    "resources/ChannelResource",
    "resources/TaskResource",
    "resources/BookResource",
    "resources/SocietyRadioResource",
    "resources/OperationalActivityResource"
], function (app) {

    var deps = ['$timeout', 'UserService', 'DiscussionResource', 'UserResource', 'CollectListResource', 'ChannelResource', 'TaskResource', 'BookResource', 'SocietyRadioResource', 'OperationalActivityResource'];

    function directive($timeout, UserService, DiscussionResource, UserResource, CollectListResource, ChannelResource, TaskResource, BookResource, SocietyRadioResource, OperationalActivityResource) {
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
                // 采纳成功执行回调,一个参数
                onAdoptSuccess: "&?",
                // 点赞数
                praiseCount: "=?",
                // 点赞状态
                praiseState: "=?",
                // 关注数
                attentionCount: "=?",
                // 关注状态
                attentionState: "=?"
            },
            link: function ($scope, element, attr) {
                $scope.enableAdopt = $scope.enableAdopt || 0;
                $scope.enableReadonly = $scope.enableReadonly || 0;

                // 点赞
                $scope.praiseState = $scope.praiseState || false;
                // 关注
                $scope.attentionState = $scope.attentionState || false;

                var user = UserService.getCurrentUser();
                $scope.userId = user.userId;

                $scope.reply = {
                    UserId: null,
                    Placeholder: "",
                    Content: "",
                    ReplyContent: ""
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
                    //等待$digest完成
                    $timeout(function () {
                        element.find(".pinglun-write").show();
                        element.find(".pl-input").focus();
                    }, 300);
                }
                // 回复
                $scope.reply = function (userId, userName, replyContent) {
                    if ($scope.enableReadonly == 0) {
                        $scope.reply.UserId = userId;
                        $scope.reply.ReplyContent = replyContent;
                        $scope.reply.Placeholder = "回复 " + userName + "：";
                        //等待$digest完成
                        $timeout(function () {
                            element.find(".pinglun-write").show();
                            element.find(".pl-input").focus();
                        }, 300);
                    }
                }
                // 发送
                $scope.send = function () {
                    if (!$scope.reply.Content) {
                        $.toast("请录入评论内容");
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

                        $scope.replyCount++;
                        $.toast("发送成功");

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
                // 采纳
                $scope.adopt = function (contextId, topicItemId) {
                    $.confirm("采纳后将不能取消，确定采纳？", "提示", function () {
                        DiscussionResource.setDiscussionMutualAdopt(contextId, topicItemId).success(function (data) {
                            if (data) {
                                var obj = _.find($scope.dataList, {topicItemId: topicItemId});
                                obj.adoptState = true;
                                $scope.adoptState = true;

                                // 清除采纳
                                _.remove($scope.dataList, {topicItemId: topicItemId});

                                // 执行回调
                                if ($scope.onAdoptSuccess) {
                                    $scope.onAdoptSuccess({"$item": obj});
                                }
                                $.toast("采纳成功");
                            }
                            else {
                                $.toast("采纳失败");
                            }
                        });
                    }, function () {
                        //取消操作
                    });
                }
                //删除评论
                $scope.delete = function (topicItemId) {
                    $.confirm("确定删除评论？", "提示", function () {
                        DiscussionResource.setDiscussionReplyState(topicItemId).success(function (data) {
                            if (data) {
                                var obj = _.find($scope.dataList, {topicItemId: topicItemId});
                                obj.showStatus = 1;
                                $.toast("删除成功");
                            }
                            else {
                                $.toast("删除失败");
                            }
                        });
                    }, function () {
                        //取消操作
                    });
                }
                // 设置点赞
                $scope.setPraise = function () {
                    // 上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：我的声音；7：好书榜；8：九三之声；9：运营活动；
                    switch (parseInt($scope.contextType)) {
                        case 1:
                            CollectListResource.assistCollect($scope.contextId).success(function (data) {
                                $scope.praiseState = !$scope.praiseState;
                                if ($scope.praiseState) {
                                    $scope.praiseCount++;
                                } else {
                                    $scope.praiseCount--;
                                }
                            });
                            break;
                        case 2:
                            ChannelResource.assistItem($scope.contextId).success(function (data) {
                                $scope.praiseState = !$scope.praiseState;
                                if (data == "0") {
                                    $scope.praiseCount++;
                                } else {
                                    $scope.praiseCount--;
                                }
                            });
                            break;
                        case 3:
                            TaskResource.setSocialTaskPraise($scope.contextId).success(function (data) {
                                $scope.praiseState = !$scope.praiseState;
                                if ($scope.praiseState) {
                                    $scope.praiseCount++;
                                } else {
                                    $scope.praiseCount--;
                                }
                            });
                            break;
                        case 7:
                            BookResource.setBookPraise($scope.contextId).success(function (data) {
                                $scope.praiseState = !$scope.praiseState;
                                if ($scope.praiseState) {
                                    $scope.praiseCount++;
                                } else {
                                    $scope.praiseCount--;
                                }
                            });
                            break;
                        case 8:
                            SocietyRadioResource.setSocietyRadioParise($scope.contextId, !$scope.praiseState).success(function (data) {
                                if (data.status) {
                                    $scope.praiseState = !$scope.praiseState;
                                    if ($scope.praiseState) {
                                        $scope.praiseCount++;
                                    } else {
                                        $scope.praiseCount--;
                                    }
                                }
                            });
                            break;
                        case 9:
                            OperationalActivityResource.setOperationalPraise($scope.contextId).success(function (data) {
                                $scope.praiseState = !$scope.praiseState;
                                if ($scope.praiseState) {
                                    $scope.praiseCount++;
                                } else {
                                    $scope.praiseCount--;
                                }
                            });
                            break;
                    }
                }
                // 设置关注
                $scope.setAttention = function () {
                    // 上下文类型：1参政议政征集；2、资讯号；3、社务；4：互助：求医问药；5、话题；6：我的声音；7：好书榜；8：九三之声；9：运营活动；
                    switch (parseInt($scope.contextType)) {
                        case 1:
                            CollectListResource.attentionCollect($scope.contextId).success(function (data) {
                                $scope.attentionState = !$scope.attentionState;
                                if ($scope.attentionState) {
                                    $scope.attentionCount++;
                                } else {
                                    $scope.attentionCount--;
                                }
                            });
                            break;
                        case 3:
                            TaskResource.setSocialTaskAttention($scope.contextId).success(function (data) {
                                $scope.attentionState = !$scope.attentionState;
                                if ($scope.attentionState) {
                                    $scope.attentionCount++;
                                } else {
                                    $scope.attentionCount--;
                                }
                            });
                            break;
                        case 9:
                            OperationalActivityResource.setOperationalAttention($scope.contextId).success(function (data) {
                                $scope.attentionState = !$scope.attentionState;
                                if ($scope.attentionState) {
                                    $scope.attentionCount++;
                                } else {
                                    $scope.attentionCount--;
                                }
                            });
                            break;
                    }
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
    return app.lazy.directive("fcCommentForWx", directive);
});
