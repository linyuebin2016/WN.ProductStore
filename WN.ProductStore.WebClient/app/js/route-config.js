define([], function () {

    return {
        defaultUrl: "/login",
        states: {
            // 登录页
            "login": {
                url: "/login",
                templateUrl: "views/login.html",
                dependencies: [
                    "controllers/LoginController"
                ],
                params: {
                    loginStep: null,
                    resetType: null
                }
            },
            // 主页面
            "home": {
                abstract: true,
                templateUrl: "views/home.html",
                dependencies: [
                    "controllers/HomeController"
                ]
            },
            //通知
            "home.notice": {
                url: "/notice",
                templateUrl: "views/notice/notice.html",
                dependencies: [
                    "controllers/notice/NoticeController"
                ]
            },
            // 参政议政 polity
            "home.polity": {
                url: "/polity/:collectType",
                templateUrl: "views/polity/polity.html",
                dependencies: [
                    "controllers/polity/PolityController"
                ],
                params: {
                    collectType: "new"
                }
            },
            // 任务 task
            "home.task": {
                url: "/task",
                templateUrl: "views/task/taskMain.html",
                dependencies: [
                    "controllers/task/TaskMainController"
                ]
            },
            // 任务-新的任务列表
            "home.task.newTaskList": {
                url: "/newTaskList/",
                templateUrl: "views/task/taskNew.html",
                dependencies: [
                    "controllers/task/TaskNewController"
                ]
            },
            //统一任务详情页
            "home.task.taskDetail": {
                url: "/taskDetail/:taskId",
                templateUrl: "views/task/taskDetail.html",
                dependencies: [
                    "controllers/task/TaskDetailController"
                ]
            },
            // 任务-新的任务详细
            "home.task.newTaskDetail": {
                url: "/newTaskDetail/:taskId",
                templateUrl: "views/task/newTaskDetail.html",
                dependencies: [
                    "controllers/task/NewTaskDetailController"
                ]
            },
            // 任务-我报名的
            "home.task.myParticipatedTaskList": {
                url: "/task/myParticipatedTaskList",
                templateUrl: "views/task/myParticipatedTaskList.html",
                dependencies: [
                    "controllers/task/MyParticipatedTaskListController"
                ]
            },
            // 任务-我负责的任务
            "home.task.myResponsibleTaskList": {
                url: "/task/myResponsibleTaskList",
                templateUrl: "views/task/myResponsibleTaskList.html",
                dependencies: [
                    "controllers/task/MyResponsibleTaskListController"
                ]
            },
            // 任务-已报名任务详情
            "home.task.enrollTaskDetail": {
                url: "/enrollTaskDetail/:taskId",
                templateUrl: "views/task/EnrollTaskDetail.html",
                dependencies: [
                    "controllers/task/EnrollTaskDetailController"
                ]
            },
            // 任务-我负责任务详情
            "home.task.responsibleTaskDetail": {
                url: "/responsibleTaskDetail/:taskId",
                templateUrl: "views/task/ResponsibleTaskDetail.html",
                dependencies: [
                    "controllers/task/ResponsibleTaskDetailController"
                ]
            },
            //任务-近期动态任务详情
            "home.task.dynamicTaskDetail": {
                url: "/dynamicTaskDetail/:taskId",
                templateUrl: "views/task/dynamic_task_detail.html",
                dependencies: [
                    "controllers/task/DynamicTaskDetailController"
                ]
            },
            // 互助 help
            "home.help": {
                url: "/help",
                templateUrl: "views/help/help.html",
                dependencies: [
                    "controllers/help/HelpController"
                ]
            },
            // 互助 新增
            "home.helpAdd": {
                url: "/helpAdd",
                templateUrl: "views/help/helpAdd.html",
                dependencies: [
                    "controllers/help/HelpAddController"
                ]
            },
            // 互助 详情
            "home.helpDetail": {
                url: "/helpDetail/:topicId",
                templateUrl: "views/help/helpDetail.html",
                dependencies: [
                    "controllers/help/HelpDetailController"
                ],
                params: {
                    topicId: null,
                    mutualType: null
                }
            },
            // 互助 列表
            "home.helpList": {
                url: "/helpList/:mutualType",
                templateUrl: "views/help/helpList.html",
                dependencies: [
                    "controllers/help/HelpListController"
                ],
                params: {
                    mutualType: null
                }
            },
            // 互助 列表详情
            "home.helpList.helpListDetail": {
                url: "/helpListDetail/:topicId",
                templateUrl: "views/help/helpListDetail.html",
                dependencies: [
                    "controllers/help/HelpListDetailController"
                ],
                params: {
                    topicId: null,
                    mutualType: null
                }
            },
            // 话题 topic
            "home.topic": {
                url: "/topic",
                templateUrl: "views/topic/topic.html",
                dependencies: [
                    "controllers/topic/topicController"
                ]
            },
            // 话题 发布
            "home.topicAdd": {
                url: "/topicAdd",
                templateUrl: "views/topic/topicAdd.html",
                dependencies: [
                    "controllers/topic/topicAddController"
                ]
            },
            // 话题 列表
            "home.topicList": {
                url: "/topicList/:listType",
                templateUrl: "views/topic/topicList.html",
                dependencies: [
                    "controllers/topic/topicListController"
                ]
            },
            // 话题 详细
            "home.topicDetail": {
                url: "/topicDetail/:topicId",
                templateUrl: "views/topic/topicDetail.html",
                dependencies: [
                    "controllers/topic/topicDetailController"
                ]
            },

            // 资讯 channel
            "home.channel": {
                url: "/channel",
                templateUrl: "views/channel/ChannelMain.html",
                dependencies: [
                    "controllers/channel/ChannelMainController"
                ]
            },
            // 资讯二级菜单
            "home.channel.channelManage": {
                url: "/channelManage:channelId,channelName,manage,pageName",
                templateUrl: "views/channel/Channel.html",
                dependencies: [
                    "controllers/channel/ChannelController"
                ],
                params: {
                    channelId: null,
                    channelName: null,
                    manage: null,
                    pageName: null
                }
            },
            // 咨询详细
            "home.channel.channelItemView": {
                url: "/channelItemView/:groupId,itemId",
                templateUrl: "views/channelItem/ChannelItemView.html",
                dependencies: [
                    "controllers/channelItem/ChannelItemViewController"
                ],
                params: {
                    groupId: null,
                    itemId: null,
                    manage: null
                }
            },
            // 资讯号内容新建
            "home.channel.channelItem": {
                url: "/channelItem/:itemId/:groupId",
                templateUrl: "views/channelItem/ChannelItemEdit.html",
                controller: "ChannelItemEditController",
                dependencies: [
                    "controllers/channelItem/ChannelItemEditController"
                ]
            },

            // 资讯 channel 你可能感兴趣的
            "home.channel.channelRecommend": {
                url: "/channelRecommend",
                templateUrl: "views/channel/channelRecommend.html",
                dependencies: [
                    "controllers/channel/ChannelRecommendController"
                ]
            },
            // 通讯录 找人
            "home.address": {
                url: "/address",
                templateUrl: "views/address/Address.html",
                dependencies: [
                    "controllers/address/AddressController"
                ]
            },
            //通讯录右侧 - 组织
            "home.address.userList": {
                url: "/userList/:groupId/:usersType",
                templateUrl: "views/user/UserList.html",
                dependencies: [
                    "controllers/user/UserListController"
                ]
            },
            // 好书 book
            "home.book": {
                url: "/book",
                templateUrl: "views/book/book.html",
                dependencies: [
                    "controllers/book/BookController"
                ]
            },
            // 好书明细
            "home.bookView": {
                url: "/bookView",
                templateUrl: "views/book/bookView.html",
                dependencies: [
                    "controllers/book/BookViewController"
                ],
                params: {
                    bookId: null
                }
            },
            // 发布好书
            "home.bookAdd": {
                url: "/bookAdd",
                templateUrl: "views/book/bookAdd.html",
                dependencies: [
                    "controllers/book/BookEditController"
                ]
            },
            // 个人设置 html
            "home.usersetting": {
                url: "/usersetting/:flag",
                templateUrl: "views/usersetting/UserSetting.html",
                dependencies: [
                    "controllers/usersetting/UserSettingController"
                ],
                params: {
                    active: null
                }
            },
            // 归档征集
            "home.polity.archiveCollectionList": {
                url: "/archiveCollectionList",
                templateUrl: "views/collect/ArchiveCollectionList.html",
                dependencies: [
                    "controllers/collect/ArchiveCollectionListController"
                ]
            },
            // 征集详细
            "home.polity.collectDetail": {
                url: "/collectDetail/:collectId",
                templateUrl: "views/collect/CollectDetail.html",
                dependencies: [
                    "controllers/collect/CollectDetailController"
                ],
                params: {
                    collectId: null
                }
            },
            // 新的征集
            "home.polity.CollectListNew": {
                url: "/CollectListNew",
                templateUrl: "views/collect/CollectListNew.html",
                dependencies: [
                    "controllers/collect/CollectListNewController"
                ]
            },
            // 我负责的
            "home.polity.CollectListPrincipal": {
                url: "/CollectListPrincipal",
                templateUrl: "views/collect/CollectListPrincipal.html",
                dependencies: [
                    "controllers/collect/CollectListPrincipalController"
                ]
            },
            // 我参与的
            "home.polity.CollectListEnter": {
                url: "/CollectListEnter",
                templateUrl: "views/collect/CollectListEnter.html",
                dependencies: [
                    "controllers/collect/CollectListEnterController"
                ]
            },
            // 我关注的
            "home.polity.CollectListAttention": {
                url: "/CollectListAttention",
                templateUrl: "views/collect/CollectListAttention.html",
                dependencies: [
                    "controllers/collect/CollectListAttentionController"
                ]
            },
            // 精华区
            "home.polity.CollectEssence": {
                url: "/CollectEssence",
                templateUrl: "views/collect/CollectEssence.html",
                dependencies: [
                    "controllers/collect/CollectEssenceController"
                ]
            },
            // 明细
            "home.Detail": {
                url: "/Detail",
                templateUrl: "views/collect/CollectListDetail.html",
                dependencies: [
                    "controllers/collect/CollectListDetailController"
                ]
            },
            // 参政议政 polity
            "home.mpolity": {
                url: "/mpolity",
                templateUrl: "views/m/task.html",
                dependencies: [
                    "controllers/m/TaskController"
                ]
            },
            // 主页
            "home.homePage": {
                url: "/homePage",
                templateUrl: "views/homePage/homePage.html",
                dependencies: [
                    "controllers/homePage/HomePageController"
                ]
            },
            // 积分详情
            "home.integralDetail": {
                url: "/integralDetail",
                templateUrl: "views/homePage/integral.html",
                dependencies: [
                    "controllers/homePage/IntegralController"
                ]
            },
            // 预览
            "home.CollectAttachView": {
                url: "/CollectAttachView",
                templateUrl: "views/collect/CollectAttachView.html",
                dependencies: [
                    "controllers/collect/CollectAttachViewController"
                ],
                params: {
                    attachURL: null,
                    type: null
                }
            },
            // 申请开通资讯号
            "home.channel.openChannel": {
                url: "/channel/openChannel",
                templateUrl: "views/channel/openChannel.html",
                dependencies: [
                    "controllers/channel/OpenChannelController"
                ]
            },
            // 管理关注
            "home.attention": {
                url: "/attention/attentionList",
                templateUrl: "views/attention/attentionList.html",
                dependencies: [
                    "controllers/attention/AttentionListController"
                ]
            },
            // 我的声音 suggestion
            "home.suggestion": {
                url: "/suggestion",
                templateUrl: "views/suggestion/suggestion.html",
                dependencies: [
                    "controllers/suggestion/SuggestionController"
                ]
            },
            // 九三之声
            "home.societyRadio": {
                url: "/societyRadio/:state",
                templateUrl: "views/societyRadio/SocietyRadio.html",
                dependencies: [
                    "controllers/societyRadio/SocietyRadioController"
                ]
            },
            // 九三之声 详情
            "home.societyRadioDetail": {
                url: "/societyRadioDetail/:radioId",
                templateUrl: "views/societyRadio/RadioDetail.html",
                dependencies: [
                    "controllers/societyRadio/RadioDetailController"
                ]
            },
            // 九三之声 推荐
            "home.societyRadioRecommend": {
                url: "/societyRadioRecommend/",
                templateUrl: "views/societyRadio/RadioRecommend.html",
                dependencies: [
                    "controllers/societyRadio/RadioRecommendController"
                ]
            },
            // 运营详情
            "home.task.operationDetail": {
                url: "/operationDetail/:taskId",
                templateUrl: "views/operation/OperationDetail.html",
                dependencies: [
                    "controllers/operation/OperationDetailController"
                ]
            },
            // 关注的社务
            "home.task.taskListAttention": {
                url: "/taskListAttention/",
                templateUrl: "views/task/TaskListAttention.html",
                dependencies: [
                    "controllers/task/TaskListAttentionController"
                ]
            }
        }
    };


});
