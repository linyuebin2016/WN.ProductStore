define([], function () {

    return {
        // 向上：若此处的修改，js/app/homecontroller的goto方法也需要同时修改
        defaultUrl: "/login",
        states: {
            // 主页面
            "home": {
                abstract: true,
                templateUrl: "views/home.html",
                dependencies: [
                    "controllers/HomeController"
                ]
            },
            //登录
            "home.login": {
                url: "/login",
                templateUrl: "views/login.html",
                dependencies: [
                    "controllers/LoginController"
                ]
            },

            /* 一级目录 begin */

            // 任务/首页
            "home.task": {
                url: "/task",
                templateUrl: "views/task.html",
                dependencies: [
                    "controllers/TaskController"
                ]
            },
            // 交流
            "home.communication": {
                url: "/communication",
                templateUrl: "views/communication.html",
                dependencies: [
                    "controllers/CommunicationController"
                ]
            },
            // 发现
            "home.discover": {
                url: "/discover",
                templateUrl: "views/discover.html",
                dependencies: [
                    "controllers/DiscoverController"
                ]
            },
            // 我
            "home.myself": {
                url: "/myself",
                templateUrl: "views/myself.html",
                dependencies: [
                    "controllers/MyselfController"
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
            //通知列表
            "home.noticeItem": {
                url: "/noticeItem",
                templateUrl: "views/notice/noticeItem.html",
                dependencies: [
                    "controllers/notice/NoticeItemController"
                ],
                params: {
                    categoryId: null,
                    iconUrl: null
                }
            },
            /* 一级目录 end */

            /* 二级目录-任务/首页 begin */


            /* 二级目录-任务/首页 end */

            /* 二级目录-交流 begin */


            /* 二级目录-交流 end */

            /* 二级目录-发现 begin */

            //=====================start 好书榜
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
            //=====================end 好书榜

            /* 二级目录-发现 end */

            /* 二级目录-我 begin */

            //=====================start  参政议政

            //征集 征集列表
            "home.appCollectList": {
                url: "/appCollectList",
                templateUrl: "views/collect/AppCollectList.html",
                dependencies: [
                    "controllers/collect/appCollectListController"
                ]
            },
            //征集 已报名征集详情
            "home.mEnrollCollectDetail": {
                url: "/mEnrollCollectDetail/:collectionId",
                templateUrl: "views/collect/mEnrollCollectDetail.html",
                dependencies: [
                    "controllers/collect/mEnrollCollectDetailController"
                ]
            },
            //征集 我负责征集详情
            "home.myResponsibleCollectDetail": {
                url: "/responsibleDetail/:collectionId",
                templateUrl: "views/collect/MyResponsibleCollectDetail.html",
                dependencies: [
                    "controllers/collect/MyResponsibleCollectDetailController"
                ]
            },

            //=====================end 参政议政

            //=====================start  社务工作（任务）

            //征集 任务列表
            "home.myTaskList": {
                url: "/myTaskList",
                templateUrl: "views/collect/AppTaskList.html",
                dependencies: [
                    "controllers/task/AppTaskListController"
                ]
            },
            // 运营详情
            "home.operationDetail": {
                url: "/operationDetail/:activityId",
                templateUrl: "views/operation/OperationDetail.html",
                dependencies: [
                    "controllers/operation/OperationDetailController"
                ]
            },
            //任务 我负责任务详情
            "home.myResponsibleDetail": {
                url: "/myResponsibleDetail/:taskId",
                templateUrl: "views/task/MyResponsibleDetail.html",
                dependencies: [
                    "controllers/task/MyResponsibleDetailController"
                ]
            },
            //任务 已报名任务详情
            "home.mEnrollTaskDetail": {
                url: "/mEnrollTaskDetail/:taskId",
                templateUrl: "views/task/mEnrollTaskDetail.html",
                dependencies: [
                    "controllers/task/mEnrollTaskDetailController"
                ]
            },

            //=====================end 我的社务工作

            //=====================end 我的声音
            //我的声音-列S表
            "home.mySuggestionList": {
                url: "/mySuggestionList",
                templateUrl: "views/suggestion/suggestion_list.html",
                dependencies: [
                    "controllers/suggestion/SuggestionListController"
                ]
            },
            //我的声音-详情
            "home.suggestionDetail": {
                url: "/suggestionDetail/:topicId",
                templateUrl: "views/suggestion/suggestion_detail.html",
                dependencies: [
                    "controllers/suggestion/SuggestionDetailController"
                ]
            },
            //我的声音-撰写
            "home.suggestionWrite": {
                url: "/suggestionWrite/:orgId/:orgName",
                templateUrl: "views/suggestion/suggestion_write.html",
                dependencies: [
                    "controllers/suggestion/SuggestionWriteController"
                ]
            },
            //=====================end 我的社务工作
            /* 二级目录-我 end */


            // //新任务列表
            // // 任务-新的任务列表
            // "home.newTaskList": {
            //     url: "/newTaskList",
            //     templateUrl: "views/task/newTaskList.html",
            //     dependencies: [
            //         "controllers/task/NewTaskListController"
            //     ]
            // },
            // // 任务-结束列表
            // "home.endRegistration": {
            //     url: "/endRegistration",
            //     templateUrl: "views/task/endRegistration.html",
            //     dependencies: [
            //         "controllers/task/EndRegistrationController"
            //     ]
            // },
            // //交流
            // "home.communication": {
            //     url: "/communication",
            //     templateUrl: "views/communication.html",
            //     dependencies: [
            //         "controllers/CommunicationController"
            //     ]
            // },
            // //咨询号
            // "home.channelHome1111": {
            //     url: "/channelHome",
            //     templateUrl: "views/channel/channelHome.html",
            //     dependencies: [
            //         "controllers/channel/ChannelHomeController"
            //     ]
            // },
            //
            // //我    微信上个人信息页面路由开始  -- ----------- - - - -- ->
            // "home.myself": {
            //     url: "/myself",
            //     templateUrl: "views/mySelf/myself.html",
            //     dependencies: [
            //         "controllers/mySelf/MyselfController"
            //     ]
            // },
            // //个人资料
            // "home.user": {
            //     url: "/user",
            //     templateUrl: "views/mobile_user/user.html",
            //     dependencies: [
            //         "controllers/mobile_user/UserController"
            //     ]
            // },
            // //学术成就
            // "home.scholarship": {
            //     url: "/scholarship",
            //     templateUrl: "views/mobile_user/scholarship.html",
            //     dependencies: [
            //         "controllers/mobile_user/ScholarShipController"
            //     ]
            // },
            // //学术成就
            // "home.userResources": {
            //     url: "/userResources",
            //     templateUrl: "views/mobile_user/userResources.html",
            //     dependencies: [
            //         "controllers/mobile_user/UserResourcesController"
            //     ]
            // },
            // //个人详细信息
            // "home.userDetailInfo": {
            //     url: "/userDetailInfo",
            //     templateUrl: "views/mobile_user/userDetailInfo.html",
            //     dependencies: [
            //         "controllers/mobile_user/UserDetailInfoController"
            //     ]
            // },

            //
            // // 资讯号
            // "home.discover1": {
            //     url: "/discover",
            //     templateUrl: "views/discover.html",
            //     dependencies: [
            //         "controllers/DiscoverController"
            //     ]
            // },
            //
            //
            // //我    微信上个人信息页面路由结束 -- -  - --------------- - -- ->
            //
            // //找人    找人模块路由开始  -- ----------- - - - -- ->
            // "home.find": {
            //     url: "/find",
            //     templateUrl: "views/contacts/find.html",
            //     dependencies: [
            //         "controllers/contacts/FindController"
            //     ]
            // },
            // "home.contacts": {
            //     url: "/contacts/:orgId",
            //     templateUrl: "views/contacts/contacts.html",
            //     dependencies: [
            //         "controllers/contacts/ContactsController"
            //     ],
            //     params: {
            //         orgId: null
            //     }
            // },
            // "home.proficients": {
            //     url: "/proficients/:catId",
            //     templateUrl: "views/contacts/proficients.html",
            //     dependencies: [
            //         "controllers/contacts/ProficientsController"
            //     ],
            //     params: {
            //         catId: null
            //     }
            // },
            // "home.userCard": {
            //     url: "/userCard",
            //     templateUrl: "views/contacts/userCard.html",
            //     dependencies: [
            //         "controllers/contacts/UserCardController"
            //     ],
            //     params: {
            //         userId: null
            //     }
            // },
            //
            // //找人   找人模块结束  -- ----------- - - - -- ->
            //
            //
            // //列表
            // "home.task.MCollectList": {
            //     url: "/MCollectList",
            //     templateUrl: "views/collect/MCollectList.html",
            //     dependencies: [
            //         "controllers/collect/MCollectListController"
            //     ]
            // },
            // // 管理关注
            // "home.attention": {
            //     url: "/attention/attentionList",
            //     templateUrl: "views/attention/mAttentionList.html",
            //     dependencies: [
            //         "controllers/attention/mAttentionListController"
            //     ]
            // },
            //=====================资讯号===============================
            //我关注的资讯号
            "home.channelAttention": {
                url: "/channelAttention",
                templateUrl: "views/channel/mChannelAttention.html",
                dependencies: [
                    "controllers/channel/mChannelAttentionController"
                ]
            },
            //资讯号发布的资讯信息列表
            "home.channelItemList": {
                url: "/channelItemList",
                templateUrl: "views/channel/mChannelItemList.html",
                dependencies: [
                    "controllers/channel/mChannelItemListController"
                ],
                params: {
                    groupId: null
                }
            },
            //资讯的明细信息
            "home.channelItemDetail": {
                url: "/channelItemDetail",
                templateUrl: "views/channel/mChannelItemDetail.html",
                dependencies: [
                    "controllers/channel/mChannelItemDetailController"
                ],
                params: {
                    groupId: null,
                    itemId: null
                }
            },
            // 资讯号详细
            "home.channelDetail": {
                url: "/channelDetail/:groupId",
                templateUrl: "views/channel/channelDetail.html",
                dependencies: [
                    "controllers/channel/ChannelDetailController"
                ]
            },
            // 资讯号详细
            "home.channelPraiseDetail": {
                url: "/channelPraiseDetail",
                templateUrl: "views/channel/praiseDetail.html",
                dependencies: [
                    "controllers/channel/PraiseDetailController"
                ],
                params: {
                    item: null
                }
            },
            // 推荐资讯号
            "home.channelRecommend": {
                url: "/m/channel/channelRecommend",
                templateUrl: "views/channel/channelRecommend.html",
                dependencies: [
                    "controllers/channel/ChannelRecommendController"
                ]
            },
            // 推荐资讯号
            "home.channelAttentionMore": {
                url: "/ChannelAttentionMore",
                templateUrl: "views/channel/ChannelAttentionMore.html",
                dependencies: [
                    "controllers/channel/ChannelAttentionMoreController"
                ]
            },
            //我的 资讯号
            "home.channelHome": {
                url: "/myChannel",
                templateUrl: "views/channel/myChannel.html",
                dependencies: [
                    "controllers/channel/MyChannelController"
                ]
            },


            //=====================end 资讯号

            //
            // // 预览
            // "home.attachView": {
            //     url: "/attachView",
            //     templateUrl: "views/attachView.html",
            //     dependencies: [
            //         "controllers/AttachViewController"
            //     ],
            //     params: {
            //         attachURL: null,
            //         type: null
            //     }
            // },
            // // 移动征集详细
            // "home.collectDetail": {
            //     url: "/collectDetail/:collectId",
            //     templateUrl: "views/collect/mCollectDetail.html",
            //     dependencies: [
            //         "controllers/collect/CollectDetailController"
            //     ],
            //     params: {
            //         collectId: null
            //     }
            // },
            // //任务 我的任务列表
            // "home.myTaskList": {
            //     url: "/myTaskList",
            //     templateUrl: "views/task/mMyTaskList.html",
            //     dependencies: [
            //         "controllers/task/MMyTaskListController"
            //     ]
            // },
            // //任务 新任务详情
            // "home.newTaskDetail": {
            //     url: "/newTaskDetail/:taskId",
            //     templateUrl: "views/task/newTaskDetail.html",
            //     dependencies: [
            //         "controllers/task/NewTaskDetailController"
            //     ]
            // },
            // //任务 新征集详情
            // "home.newCollectDetail": {
            //     url: "/newCollectDetail/:collectId",
            //     templateUrl: "views/collect/newCollectDetail.html",
            //     dependencies: [
            //         "controllers/collect/NewCollectDetailController"
            //     ]
            // },
            // //任务 结束任务详情
            // "home.endTaskDetail": {
            //     url: "/endTaskDetail/:taskId",
            //     templateUrl: "views/task/endTaskDetail.html",
            //     dependencies: [
            //         "controllers/task/EndTaskDetailController"
            //     ]
            // },

            // //任务 近期动态详情
            // "home.dynamicTaskDetail": {
            //     url: "/dynamicTaskDetail/:taskId",
            //     templateUrl: "views/task/dynamic_task_detail.html",
            //     dependencies: [
            //         "controllers/task/DynamicTaskDetailController"
            //     ]
            // },
            // //征集 已报名征集详情
            // "home.mEnrollCollectDetail": {
            //     url: "/mEnrollCollectDetail/:collectionId",
            //     templateUrl: "views/collect/mEnrollCollectDetail.html",
            //     dependencies: [
            //         "controllers/collect/mEnrollCollectDetailController"
            //     ]
            // },

            // //征集 我负责征集详情
            // "home.myResponsibleCollectDetail": {
            //     url: "/responsibleDetail/:collectionId",
            //     templateUrl: "views/collect/MyResponsibleCollectDetail.html",
            //     dependencies: [
            //         "controllers/collect/MyResponsibleCollectDetailController"
            //     ]
            // },
            // //任务 我负责任务报名人详情
            // "home.taskUsersClockCount": {
            //     url: "/taskUsersClockCount/:taskId",
            //     templateUrl: "views/task/TaskUsersClockCount.html",
            //     dependencies: [
            //         "controllers/task/TaskUsersClockCountController"
            //     ]
            // },
            //求医问药、话题讨论列表(嵌入)
            "home.communication.doctorTopicList": {
                url: "/doctorTopicList/:contextType/:listType",
                templateUrl: "views/doctorTopic/doctorTopicList.html",
                dependencies: [
                    "controllers/doctorTopic/doctorTopicListController"
                ]
            },
            //求医问药、话题讨论列表
            "home.doctorTopicList": {
                url: "/doctorTopicList/:contextType/:listType",
                templateUrl: "views/doctorTopic/doctorTopicList.html",
                dependencies: [
                    "controllers/doctorTopic/doctorTopicListController"
                ]
            },
            //求医问药、话题讨论发布
            "home.newDoctorTopic": {
                url: "/newDoctorTopic/:contextType",
                templateUrl: "views/doctorTopic/newDoctorTopic.html",
                dependencies: [
                    "controllers/doctorTopic/newDoctorTopicController"
                ]
            },
            //求医问药、话题讨论明细
            "home.doctorTopicDetail": {
                url: "/doctorTopicDetail/:topicId/:contextType/:detailType",
                templateUrl: "views/doctorTopic/doctorTopicDetail.html",
                dependencies: [
                    "controllers/doctorTopic/doctorTopicDetailController"
                ]
            },
            //我的  求医问药
            "home.myDoctorTopicList": {
                url: "/myDoctorTopicList/:contextType",
                templateUrl: "views/doctorTopic/myDoctorTopicList.html",
                dependencies: [
                    "controllers/doctorTopic/myDoctorTopicListController"
                ]
            },

            //我的  求医问药、话题讨论列表(嵌入)
            "home.myDoctorTopicList.doctorTopicList": {
                url: "/doctorTopicList/:contextType/:listType",
                templateUrl: "views/doctorTopic/doctorTopicList.html",
                dependencies: [
                    "controllers/doctorTopic/doctorTopicListController"
                ]
            },
            // //任务 负责人打卡
            // "home.openClock": {
            //     url: "/openClock/:taskId",
            //     templateUrl: "views/task/OpenClock.html",
            //     dependencies: [
            //         "controllers/task/OpenClockController"
            //     ]
            // },

            // //基层声音-列表
            // "home.basicSgtList": {
            //     url: "/basicSgtList",
            //     templateUrl: "views/suggestion/suggestion_basic_list.html",
            //     dependencies: [
            //         "controllers/suggestion/SuggestionBasicListController"
            //     ]
            // },
            // //基层声音-详情
            // "home.basicSgtDetail": {
            //     url: "/basicSgtDetail/:topicId",
            //     templateUrl: "views/suggestion/suggestion_basic_detail.html",
            //     dependencies: [
            //         "controllers/suggestion/SuggestionBasicDetailController"
            //     ]
            // },
            // //个人设置-回复提醒
            // "home.replyNotice": {
            //     url: "/replyNotice",
            //     templateUrl: "views/replyNotice/ReplyNotice.html",
            //     dependencies: [
            //         "controllers/replyNotice/ReplyNoticeController"
            //     ]
            // },
            // //我的声音-撰写-搜索发送组织
            // "home.suggestionSearchOrg": {
            //     url: "/suggestionSearchOrg",
            //     templateUrl: "views/suggestion/suggestion_search_org.html",
            //     dependencies: [
            //         "controllers/suggestion/SuggestionSearchOrgController"
            //     ]
            // },
            // //九三之声-收听
            // "home.listenRadio": {
            //     url: "/listenRadio",
            //     templateUrl: "views/societyRadio/ListenRadio.html",
            //     dependencies: [
            //         "controllers/societyRadio/ListenRadioController"
            //     ]
            // },
            // //九三之声-详细
            // "home.radioDetail": {
            //     url: "/radioDetail/:recommend/:radioId",
            //     templateUrl: "views/societyRadio/RadioDetail.html",
            //     dependencies: [
            //         "controllers/societyRadio/RadioDetailController"
            //     ]
            // },
            // //九三之声-推荐列表
            // "home.recommendList": {
            //     url: "/recommendList",
            //     templateUrl: "views/societyRadio/RecommendList.html",
            //     dependencies: [
            //         "controllers/societyRadio/RecommendListController"
            //     ]
            // },
            // //九三之声-发布声音【新录音】
            // "home.newRecord": {
            //     url: "/newRecord",
            //     templateUrl: "views/societyRadio/NewRecord.html",
            //     dependencies: [
            //         "controllers/societyRadio/NewRecordController"
            //     ]
            // },

            // //钱包
            // "home.rewardManage": {
            //     url: "/rewardManage",
            //     templateUrl: "views/reward/rewardManage.html",
            //     dependencies: [
            //         "controllers/reward/rewardManageController"
            //     ]
            // },
            // //零钱明细
            // "home.moneyDetail": {
            //     url: "/moneyDetail",
            //     templateUrl: "views/reward/moneyDetail.html",
            //     dependencies: [
            //         "controllers/reward/moneyDetailController"
            //     ]
            // },
            // //打赏明细
            // "home.rewardList": {
            //     url: "/rewardList",
            //     templateUrl: "views/reward/rewardList.html",
            //     dependencies: [
            //         "controllers/reward/rewardListController"
            //     ]
            // },
            // //抽奖明细
            // "home.drawDetail": {
            //     url: "/drawDetail/:drawId",
            //     templateUrl: "views/operation/DrawDetail.html",
            //     dependencies: [
            //         "controllers/operation/DrawDetailController"
            //     ]
            // },
            // //抽奖打卡
            // "home.drawClock": {
            //     url: "/drawClock/:drawId",
            //     templateUrl: "views/operation/DrawClock.html",
            //     dependencies: [
            //         "controllers/operation/DrawClockController"
            //     ]
            // },
            // //抽奖人员列表
            // "home.drawPersonList": {
            //     url: "/drawPersonList/:drawId/:directorState",
            //     templateUrl: "views/operation/DrawPersonList.html",
            //     dependencies: [
            //         "controllers/operation/DrawPersonListController"
            //     ]
            // },
            // //兑换奖品
            // "home.redeemGift": {
            //     url: "/redeemGift/:redeemId",
            //     templateUrl: "views/operation/RedeemGift.html",
            //     dependencies: [
            //         "controllers/operation/RedeemGiftController"
            //     ]
            // },

            // //首页
            // "home.homePage": {
            //     url: "/homePage",
            //     templateUrl: "views/homePage/homePage.html",
            //     dependencies: [
            //         "controllers/homePage/HomePageController"
            //     ]
            // }
        }
    };


});