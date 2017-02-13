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
    }
  ])
  .controller('Controller',['$scope','$route', '$log','$http',
      function($scope, $route, $log,$http){
          $scope.name = "盛向阳";
  }]);
