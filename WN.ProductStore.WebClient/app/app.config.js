'use strict';

angular.module('phonecatApp',['ngRoute']).
config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
    when('/phones', {
      template: '<phone-list></phone-list>'
    }).
    when('/phones/:phoneId', {
      template: '<phone-detail></phone-detail>'
    }).
    // when('/product', {
    //   template: '<h1>111</h1>',
    //   controller :'controller/product/productController'
    // }).
 
    otherwise('/phones');
  }
]);