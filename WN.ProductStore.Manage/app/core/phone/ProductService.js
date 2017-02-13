'use strict';

angular.module('myApp',['ngResource']).
  provider('Product', ['$http',
    function($http) {
      return{
        getProductList: function(){
           $http.get("http://10.52.0.87/ProductStroe/api/Product?pageIndex=0&pageSize=10&name=")
              .success(function (response) {
                return response;
           });
        }
      }
    }
  ]);
