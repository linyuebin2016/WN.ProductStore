'use strict';

angular.
  module('myApp',['ngAnimate','ngRoute','ui.router']).
  config(['$locationProvider' ,'$routeProvider','$stateProvider','$urlRouterProvider',
    function config($locationProvider, $routeProvider,$stateProvider, $urlRouterProvider) {
        //$locationProvider.hashPrefix('!');
        /*路由重定向 $urlRouterProvider:如果没有路由引擎能匹配当前的导航状态，那它就会默认将路径路由至 home.html,
        *这个页面就是状态名称被声明的地方. */
        $urlRouterProvider.otherwise('/home');

        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        }).
        state('product', {
            url: '/product',
            templateUrl: 'product/product-list.html',
            controller: 'ProductListController'
        });


        /*$routeProvider.
        when('/', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        }).
        when('/product', {
            templateUrl: 'product/product-list.html',
            controller: 'ProductListController'
        }).
<<<<<<< HEAD
        otherwise('/home');*/
=======
        when("/phone",{
          template:'<phone-list></phone-list>'
        }).
        otherwise('/product');
>>>>>>> 99f6b0a9d00d7f55269faf442b4c17ec1664bb1b
    }
  ])
  .controller('Controller',['$scope','$route', '$log','$http',
      function($scope, $route, $log,$http){
          $scope.name = "盛向阳";
  }]);
