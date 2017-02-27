/**菜单的配置信息**/
define(["app"], function(app) {
    app.lazy.service("MenuService", function() {
        return {
            config: {
                usersetting: {
                    name: '个人设置',
                    routeURL: 'home.usersetting',
                    locationURL: '/usersetting'
                },
                homePage: {
                    name: '主页',
                    routeURL: 'home.homePage',
                    locationURL: '/homePage',
                    IconClass: 'i1'
                },
                polity: {
                    name: '参政议政',
                    routeURL: 'home.polity',
                    locationURL: '/polity',
                    IconClass: 'i2',
                    topicType: 1
                },
                task: {
                    name: '任务',
                    routeURL: 'home.task',
                    locationURL: '/task',
                    IconClass: 'i3',
                    topicType: 3
                },
                help: {
                    name: '互助',
                    routeURL: 'home.help',
                    locationURL: '/help',
                    IconClass: 'i4',
                    topicType: 4
                },
                topic: {
                    name: '话题',
                    routeURL: 'home.topic',
                    locationURL: '/topic',
                    IconClass: 'i5',
                    topicType: 5
                },
                channel: {
                    name: '资讯号',
                    routeURL: 'home.channel',
                    locationURL: '/channel',
                    IconClass: 'i6',
                    topicType: 2
                },
                address: {
                    name: '找人',
                    routeURL: 'home.address',
                    locationURL: '/address',
                    IconClass: 'i7',
                    topicType: 10
                },
                book: {
                    name: '好书',
                    routeURL: 'home.book',
                    locationURL: '/book',
                    IconClass: 'i8',
                    topicType: 7
                },
                societyRadio: {
                    name: '九三之声',
                    routeURL: 'home.societyRadio',
                    locationURL: '/societyRadio',
                    IconClass: 'i9',
                    topicType: 8
                },
                suggestion: {
                    name: '我的声音',
                    routeURL: 'home.suggestion',
                    locationURL: '/suggestion',
                    IconClass: 'i10',
                    topicType: 6
                }
            },

            firstLevelMenus: ['own', 'partner', 'competence'],

            queryContextTypeByLocationURLforWX: function(toState, toParams) {
                //TODO过滤人员详情
                if (toState && toState.name == "home.userCard") {
                    return null;
                }
                if (toParams && toParams.contextType) {
                    // 交流，包括了：互助，话题
                    return toParams.contextType;
                } else if (toState) {
                    if (toState.templateUrl.indexOf("doctorTopicList/4") > -1) {
                        return "4"
                    } else if (toState.templateUrl.indexOf("doctorTopicList/5") > -1) {
                        return "5"
                    } else if (toState.name == "home.newTaskList" || toState.name == "home.myTaskList" || toState.templateUrl.indexOf("/newTaskList?code") > -1 || toState.templateUrl.indexOf("/myTaskList?code") > -1) {
                        // 新任务和新动态，我的任务，包括了：参政议政，社务工作
                        return "1,3";
                    } else if (toState.name == "home.newCollectDetail" || toState.templateUrl.indexOf("views/collect") > -1) {
                        // 参政议政
                        return "1";
                    } else if (toState.name == "home.newTaskDetail" || toState.templateUrl.indexOf("views/task") > -1 ) {
                        // 任务
                        return "3";
                    } else if (toState.name == "home.discover" || toState.templateUrl.indexOf("views/channel") > -1  || toState.templateUrl.indexOf("/discover?code") > -1) {
                        // 资讯号
                        return "2";
                    } else if (toState.templateUrl.indexOf("views/contacts") > -1 || toState.templateUrl.indexOf("/find?code") > -1) {
                        // 找人
                        return "10";
                    } else if (toState.templateUrl.indexOf("views/book") > -1 || toState.templateUrl.indexOf("/book?code") > -1) {
                        // 好书
                        return "7";
                    } else if (toState.templateUrl.indexOf("views/societyRadio") > -1 || toState.templateUrl.indexOf("/listenRadio?code") > -1) {
                        // 九三之声
                        return "8";
                    }
                }
                return null;
            },

            queryByLocationURL: function(locationURL) {
                if (this.config && locationURL) {
                    if (locationURL.indexOf('usersetting') > -1) {
                        return this.config['usersetting'];
                    }
                    if (locationURL.indexOf('homePage') > -1) {
                        return this.config['homePage'];
                    }
                    if (locationURL.indexOf('polity') > -1) {
                        return this.config['polity'];
                    }
                    if (locationURL.indexOf('task') > -1) {
                        return this.config['task'];
                    }
                    if (locationURL.indexOf('help') > -1) {
                        return this.config['help'];
                    }
                    if (locationURL.indexOf('topic') > -1) {
                        return this.config['topic'];
                    }
                    if (locationURL.indexOf('channel') > -1) {
                        return this.config['channel'];
                    }
                    if (locationURL.indexOf('address') > -1) {
                        return this.config['address'];
                    }
                    if (locationURL.indexOf('book') > -1) {
                        return this.config['book'];
                    }
                    if (locationURL.indexOf('suggestion') > -1) {
                        return this.config['suggestion'];
                    }
                    if (locationURL.indexOf('societyRadio') > -1) {
                        return this.config['societyRadio'];
                    }
                }
                return {};
            }
        };
    });
});
