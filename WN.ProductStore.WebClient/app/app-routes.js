define(function (require) {
    var app = require('./app.config');

    app.run(['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.title = "商城";
    }]);

    app.config(['$stateProvider', '$urlRouterProvider',
        function config($stateProvider, $urlRouterProvider) {
            /*路由重定向 $urlRouterProvider:如果没有路由引擎能匹配当前的导航状态，那它就会默认将路径路由至 home.html,
             *这个页面就是状态名称被声明的地方. */
            $urlRouterProvider.otherwise('/home');

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'views/home.html',
                    controllerUrl: 'controller/HomeController',
                    controller: 'HomeController'
                }).
            state('home.homePage', {
                url: '/homePage',
                templateUrl: 'views/homePage/homePage.html',
                controllerUrl: 'controller/homePage/HomePageController',
                controller: 'HomePageController'
            }).
            state('home.productList', {
                url: '/productList',
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
                dependencies: ['core/ProductService', 'core/CarService'],
                params: {
                    spid: null
                }
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
            //客户
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
            state('home.customerHome', {
                url: '/customerHome',
                templateUrl: 'views/customer/customeHome.html',
                controllerUrl: 'controller/customer/CustomerHomeController',
                controller: 'CustomerHomeController',
                dependencies: ['core/CustomerService']
            }).
            //订单
            state('orderList', {
                url: '/orderList',
                templateUrl: 'views/order/orderList.html',
                controllerUrl: 'controller/order/OrderListController',
                controller: 'OrderListController',
                dependencies: ['core/OrderService']
            }).
            state('orderAdd', {
                url: '/orderAdd',
                templateUrl: 'views/order/orderAdd.html',
                controllerUrl: 'controller/order/OrderAddController',
                controller: 'OrderAddController',
                dependencies: ['core/OrderService'],
                params: {
                    cars: null
                }
            }).
            //购物车
            state('home.carList', {
                url: '/carList',
                templateUrl: 'views/car/carList.html',
                controllerUrl: 'controller/car/CarListController',
                controller: 'CarListController',
                dependencies: ['core/CarService']
            });
        }
    ]);
});