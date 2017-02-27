define(["angular",
    "route-config-app",
    "postal",
    "angularLocale",
    "uiRoute",
    "angularResource",
    //"angularAnimate",
    "angularCookies",
    "angularSanitize",
    "bootstrapUI",
    "uislider",
    "angularUEditor",
    "uirouterextras",
    "ngDraggable",
    "lodash",
    "uiSelect",
    "soundManager"
], function (angular, routeConfig, postal, _) {
    var app = angular.module("manage", ["ui.router", "ngResource", "ngSanitize", "ngCookies", "ui.bootstrap", "ui.slider", "ng.ueditor", "ct.ui.router.extras", "ngDraggable", "ui.select"]);

    app.config(["$locationProvider",
        "$controllerProvider",
        "$compileProvider",
        "$filterProvider",
        "$provide",
        "$stateProvider",
        "$urlRouterProvider",
        "$httpProvider",
        "$sceProvider",
        function ($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider, $urlRouterProvider, $httpProvider, $sceProvider) {

            app.lazy = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            $sceProvider.enabled(false);

            if (routeConfig.states !== undefined) {
                angular.forEach(routeConfig.states, function (route, state) {
                    if (route.dependencies !== undefined && route.dependencies.length > 0) {
                        route.resolve = resolve(route.dependencies);
                    }
                    $stateProvider.state(state, route);
                });
            }
            if (routeConfig.defaultUrl !== undefined) {
                $urlRouterProvider.otherwise(routeConfig.defaultUrl);
            }

            $httpProvider.defaults.transformRequest = [function (data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
            }];

            $httpProvider.defaults.headers.common['FORGED-USER-AGENT'] = 'pcclient';

            $httpProvider.interceptors.push(["$q", "$rootScope", "$timeout", function ($q, $rootScope, $timeout) {

                $rootScope.loading = 0;

                // 更新loading 的状态
                // function updateLoadState(config, diff) {
                //     if (!config
                //         || (!(config.url.indexOf("restful/monitor/user") > -1 ) && !(config.url.indexOf("restful/channel/queryChannelListMobile") > -1 )
                //         && !(config.url.indexOf("restful/user/countNoReadShareAtMe") > -1 )
                //         && !(config.url.indexOf("restful/monitor/user") > -1 ) && (config.url.indexOf("restful/conversation/") !== -1
                //         || config.url.indexOf("restful/task/") !== -1
                //         || config.url.indexOf("restful/channel/") !== -1
                //         || config.url.indexOf("restful/space/") !== -1
                //         || config.url.indexOf("restful/colleague/") !== -1
                //         || config.url.indexOf("restful/address/") !== -1
                //         || config.url.indexOf("conversation/queryTopicNoitces/") !== -1
                //         || config.url.indexOf("conversation/setConversationReaded/") !== -1))) {
                //         $timeout(function () {
                //             $rootScope.loading += diff;
                //         }, 0);
                //     }
                // }

                function updateLoadState(config, diff) {
                    if (config.url.indexOf("restful/") !== -1) {
                        $timeout(function () {
                            $rootScope.loading += diff;
                        }, 0);
                    }
                }

                return {
                    "request": function (config) {
                        updateLoadState(config, 1);
                        return config;
                    },

                    "response": function (response) {
                        updateLoadState(response.config, -1);
                        return response;
                    },

                    'responseError': function (rejection) {
                        updateLoadState(rejection.config, -1);
                        if (rejection.status == 401) {
                            if (rejection.config.url.indexOf("contactsController/queryConverContacts") > -1) {
                                $rootScope.$emit('login.error.reload', {
                                    callback: function () {
                                        var gui = requireNode('nw.gui');
                                        var win = gui.Window.get();
                                        win.reload();
                                    }
                                })
                            } else {
                                location.href = "#/login";
                            }
                        }
                        return $q.reject(rejection);
                    }
                };
            }]);
        }]);

    app.config(['$provide', function ($provide) {
        $provide.decorator('$rootScope', ['$delegate', function ($delegate) {
            Object.defineProperty($delegate.constructor.prototype, '$bus', {
                get: function () {
                    var self = this;
                    return {
                        subscribe: function () {
                            var sub = postal.subscribe.apply(postal, arguments);
                            self.$on('$destroy', function () {
                                if (sub) {
                                    sub.unsubscribe();
                                }
                                sub = null;
                            });
                            return sub;
                        },
                        channel: function () {
                            return postal.channel.apply(postal, arguments);
                        },
                        publish: function () {
                            postal.publish.apply(postal, arguments);
                        }
                    };
                },
                enumerable: false
            });

            return $delegate;
        }]);
    }]);

    function resolve(dependencies) {
        return {
            deps: ["$q", function ($q) {
                var deferred = $q.defer();

                require(dependencies, function () {
                    deferred.resolve();
                });

                return deferred.promise;
            }]
        };
    }

    return app;
});
