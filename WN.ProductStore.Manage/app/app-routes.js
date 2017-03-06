define(function (require) {
    var app = require('./app.config');

    app.run(['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.name = "盛向阳";
    }]);

    app.config(['$stateProvider', '$urlRouterProvider',
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
                templateUrl: 'views/product/product-list.html',
                controllerUrl: 'controller/ProductListController',
                controller: 'ProductListController',
                dependencies: ['core/ProductService']
            }).
            state('productAM', {
                url: '/productAM/:spid',
                templateUrl: 'views/product/product-add-modify.html',
                controllerUrl: 'controller/ProductAMController',
                controller: 'ProductAMController',
                dependencies: ['core/ProductService']
            }).
            state('productDetail', {
                url: '/productDetail/:spid',
                templateUrl: 'views/product/productDetail.html',
                controllerUrl: 'controller/ProductDetailController',
                controller: 'ProductDetailController',
                dependencies: ['core/ProductService']
            }).
            state('stockList', {
                url: '/stockList',
                templateUrl: 'views/stock/stock-List.html',
                controllerUrl: 'controller/StockListController',
                controller: 'StockListController',
                dependencies: ['core/StockService']
            }).
            state('stockIn', {
                url: '/stockIn',
                templateUrl: 'views/stock/stockIn.html',
                controllerUrl: 'controller/StockInController',
                controller: 'StockInController',
                dependencies: ['core/StockService']
            }).
            state('stockAdd', {
                url: '/stockAdd/:productId',
                templateUrl: 'views/stock/stockAdd.html',
                controllerUrl: 'controller/StockAddController',
                controller: 'StockAddController',
                dependencies: ['core/StockService'],
                params: {
                    product: null,
                    stockId: null
                }
            }).
            state('customerList', {
                url: '/customerList',
                templateUrl: 'views/customer/customerList.html',
                controllerUrl: 'controller/CustomerController',
                controller: 'CustomerController',
                dependencies: ['core/CustomerService']
            }).
            state('customerAdd', {
                url: '/customerAdd',
                templateUrl: 'views/customer/customer-add-modify.html',
                controllerUrl: 'controller/CustomerAddController',
                controller: 'CustomerAddController',
                dependencies: ['core/CustomerService'],
                params: {
                    customerid: null
                }
            }).
            state('orderList', {
                url: '/orderList',
                templateUrl: 'views/order/orderList.html',
                controllerUrl: 'controller/order/OrderListController',
                controller: 'OrderListController',
                dependencies: ['core/OrderService']
            });
        }
    ]);
});