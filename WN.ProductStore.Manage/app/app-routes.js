define(function (require) {
    var app = require('./app.config');

    app.run(['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.name = "盛向阳";
    }]);

    app.config(['$stateProvider','$urlRouterProvider',
        function config($stateProvider, $urlRouterProvider) {
            /*路由重定向 $urlRouterProvider:如果没有路由引擎能匹配当前的导航状态，那它就会默认将路径路由至 home.html,
             *这个页面就是状态名称被声明的地方. */
            $urlRouterProvider.otherwise('/home');

            $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/home.html',
                controllerUrl: 'controller/HomeController',
                controller: 'HomeController'
            }).
            state('product', {
                url: '/product',
                templateUrl: 'product/product-list.html',
                controllerUrl: 'controller/ProductListController',
                controller: 'ProductListController',
                dependencies: ['core/ProductService']
            });
        }
    ]);
});
