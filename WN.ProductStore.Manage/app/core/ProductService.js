define(function (require) {
    var angular = require('angular');
    var app = require('../app.config');
    app.service('ProductService', ['$http',function($http) {

        var postHeader = {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        var requestUrl = "http://10.52.0.87/ProductStroe/api";

        return {
            //获取商品列表
            getProductList : function() {
                return $http.get(requestUrl +'/Product',{
                    params: {
                        pageIndex: 0,
                        pageSize: 10,
                        name:''
                    }
                })
            },

            //获取商品详细信息
            getProductDetail : function(spid) {
                return $http.get(requestUrl + "/Product/getproduct",{
                    params: {
                        id: spid
                    }
                })
            },
            
            //新增商品信息
            saveProduct : function (product) {
                var transFn = function (product) {
                    return $.param(product);
                };
                var postCfg = {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transFn
                };
                return $http.post(requestUrl + "/Product/add", product, postCfg);
            },

            //上传图片
            uploadImg : function (imgs) {
                var transFn = function (imgs) {
                    return $.param(imgs);
                };
                var postCfg = {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: imgs
                };
                return $http.post(requestUrl + "/Image/ImgUpload", imgs, postCfg);
            }
        };
    }]);
});
