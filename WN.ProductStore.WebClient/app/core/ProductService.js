define(function (require) {
    var angular = require('angular');
    var app = require('../app.config');
    app.service('ProductService', ['$http', 'baseUrl', function ($http, baseUrl) {

        var postHeader = {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        return {
            //获取商品列表
            getProductList: function (pageIndex, pageSize, queryString) {
                return $http.get(baseUrl + '/Product/GetProductList', {
                    params: {
                        pageIndex: pageIndex,
                        pageSize: pageSize,
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
            saveProduct: function (product) {
                var transFn = function (product) {
                    return $.param(product);
                };
                var postCfg = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transFn
                };
                return $http.post(baseUrl + "/Product/Add", product, postCfg);
            },

            //更新商品信息
            update: function (product) {
                var transFn = function (product) {
                    return $.param(product);
                };
                var postCfg = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transFn
                };
                return $http.post(baseUrl + "/Product/Update", product, postCfg);
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