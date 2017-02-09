'use strict';

angular.module('myApp',['ngResource']).
  factory('Product', ['$http','$resource',
    function($http,$resource) {
      return{
        getProductList: function(){
          return $resource('http://10.52.0.87/ProductStroe/api/Product?pageIndex=0&pageSize=10&name=', {}, {
            query: {
              method: 'GET',
              params: {phoneId: 'phones'},
              isArray: true
            }
          });
        }
      }
    }
  ]);
