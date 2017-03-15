/**
 * Created by shengxiangyang on 2017-02-14.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductDetailController', ['$scope', '$http', '$sce', '$state', '$stateParams', 'ProductService', 'baseImgServer',
        function ($scope, $http, $sce, $state, $stateParams, ProductService, baseImgServer) {
            $scope.baseImgServer = baseImgServer;


            $scope.productDetail = {};
            $scope.productImages = [];

            var spid = $stateParams.spid;
            $scope.isEdit = false;
            $scope.title = "新增商品";
            if (spid != null && spid != "") {
                getProductDetail(spid);
                $scope.isEdit = true;
                $scope.title = "商品详细";
            }


            function getProductDetail(spid) {
                ProductService.getProductDetail(spid).success(function (response) {
                    $scope.productDetail = response.Product;
                    $('#summernote_sp').summernote('code', $scope.productDetail.Content);
                    $scope.productDetail.Content = $sce.trustAsHtml($scope.productDetail.Content);
                    $scope.productImgUrl = $scope.productDetail.ImageUrl;
                    $scope.productImages = response.ProductImages;
                });
            }





        }
    ]);
});