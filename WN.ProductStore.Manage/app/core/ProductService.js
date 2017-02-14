define(function (require) {
    var angular = require('angular');
    var app = require('../app.config');
    app.service('ProductService', ['$http',function($http) {
        return {
            getProductList : function() {
                return $http.get("http://10.52.0.87/ProductStroe/api/Product",{
                    params: {
                        pageIndex: 0,
                        pageSize: 10,
                        name:''
                    }
                })
            }
        };
    }]);
    //var angular = require('angular');
    //var app = require('../app.config');
    //
    //// put into a new module for demo
    //var module = angular.module('product.s.modoule', []);
    //
    //    module.service('ProductService', function ($http) {
    //    return {
    //        getProductList: function(){
    //            return $http.get("http://10.52.0.87/ProductStroe/api/Product",{
    //                params: {
    //                    pageIndex: 0,
    //                    pageSize: 10,
    //                    name:''
    //                }
    //            });
    //        }
    //    };
    //});
    //
    //app.useModule('product.s.modoule');
});
