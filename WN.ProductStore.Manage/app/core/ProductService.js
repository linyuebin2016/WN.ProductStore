define(function (require) {
    var angular = require('angular');
    var app = require('../app.config');
    app.service('ProductService', ['$http', 'baseUrl', function ($http, baseUrl) {

        var postHeader = {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        return {
            //获取商品列表
            getProductList: function (pageIndex,pageSize,queryString) {
                return $http.get(baseUrl + '/Product/GetProductList', {
                    params: {
                        pageIndex: 1,
                        pageSize: 10,
                        queryString: queryString
                    }
                })
            },

            //获取商品详细信息
            getProductDetail: function (spid) {
                return $http.get(baseUrl + "/Product/GetProduct", {
                    params: {
                        id: spid
                    }
                })
            },

            //新增商品信息
            saveProduct: function (ProductView) {
                var transFn = function (ProductView) {
                    return $.param(ProductView);
                };
                var postCfg = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transFn
                };
                return $http.post(baseUrl + "/Product/Add", ProductView, postCfg);
            },

            //更新商品信息
            update: function (ProductView) {
                var transFn = function (ProductView) {
                    return $.param(ProductView);
                };
                var postCfg = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transFn
                };
                return $http.post(baseUrl + "/Product/Update", ProductView, postCfg);
            },

            //上传图片
            uploadImg: function (imgs) {
                return $http({
                    method: 'post',
                    url: baseUrl + '/Image/ImgUpload',
                    data: imgs,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                })
            },

            //删除上传的图片
            delUploadImg: function (imgUrl) {
                return $http.get(baseUrl + '/Image/DeleteImage', {
                    params: {
                        url: imgUrl
                    }
                })
            },
            //获取商品详细信息
            delete: function (id) {
                return $http.get(baseUrl + "/Product/delete", {
                    params: {
                        id: id
                    }
                })
            },
        };
    }]);
});