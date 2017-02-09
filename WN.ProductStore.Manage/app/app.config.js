'use strict';

angular.
  module('myApp',['ngAnimate','ngRoute']).
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/product', {
            templateUrl: 'product/product-list.html',
            controller: 'ProductListController'
        }).
        otherwise('/product');
    }
  ]);
