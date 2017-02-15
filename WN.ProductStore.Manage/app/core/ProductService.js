define(function (require) {
    var angular = require('angular');
    var app = require('../app.config');
    app.service('ProductService', ['$http',function($http) {

        var postHeader = {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        return {
            //获取商品列表
            getProductList : function() {
                return $http.get("http://10.52.0.87/ProductStroe/api/Product",{
                    params: {
                        pageIndex: 0,
                        pageSize: 10,
                        name:''
                    }
                })
            },

            //获取商品详细信息
            getProductDetail : function(spid) {
                return $http.get("http://10.52.0.87/ProductStroe/api/Product/getproduct",{
                    params: {
                        id: spid
                    }
                })
            },
            
            //新增商品信息
            saveProduct : function (product) {
                return $http.post("http://10.52.0.87/ProductStroe/api/Product/add", {
                    Product: product
                }, {
                    headers: postHeader
                });
            }
        };
    }]);
});
