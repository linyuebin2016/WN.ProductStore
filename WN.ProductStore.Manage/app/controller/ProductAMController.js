/**
 * Created by shengxiangyang on 2017-02-14.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductAMController', ['$scope', '$http', '$sce', '$state', '$stateParams', 'ProductService', 'baseImgServer',
        function ($scope, $http, $sce, $state, $stateParams, ProductService, baseImgServer) {
            $scope.baseImgServer = baseImgServer;
            //商品封面图片URL
            $scope.productImgUrl = null;
            $('.form_datetime').datetimepicker({
                minView: "month", //选择日期后，不会再跳转去选择时分秒
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                todayBtn: 1,
                autoclose: 1
            });

            $('.summernote').summernote({
                height: 300,
                lang: 'zh-CN',
                placeholder: '请输入内容...',
                disableDragAndDrop: true,
            });

            $scope.productDetail = {};
            $scope.productImages = [];
            $scope.productImage = {
                url: null,
                ProductId: null
            };
            var spid = $stateParams.spid;
            $scope.isEdit = false;
            $scope.title = "新增商品";
            if (spid != null && spid != "") {
                getProductDetail(spid);
                $scope.isEdit = true;
                $scope.title = "商品更新";
            }

            function getProductDetail(spid) {
                ProductService.getProductDetail(spid).success(function (response) {
                    $scope.productDetail = response.Product;
                    $('#summernote_sp').summernote('code', $scope.productDetail.Content);
                    $scope.productDetail.Content = $sce.trustAsHtml($scope.productDetail.Content);
                    $scope.productImage.ProductId = $scope.productDetail.Id;
                    $scope.productImgUrl = $scope.productDetail.ImageUrl;
                });
            }

            $scope.save = function () {
                $scope.productDetail.Content = $('#summernote_sp').summernote('code');
                $scope.productDetail.ProductImages = $scope.productImages;
                $scope.productDetail.ImageUrl = $scope.productImgUrl;
                ProductService.saveProduct($scope.productDetail).success(function (resultJson) {
                    alert(resultJson + "新增成功");
                }).error(function (e) {
                    console.log('系统异常');
                });
            };

            //封面图片上传
            $scope.thumb = [];
            $scope.fmImg_upload = function (files) {
                var data = new FormData();
                data.append('image', files[0]);
                ProductService.uploadImg(data).success(function (resp) {
                    if (resp.errmsg == '上传成功') {
                        $scope.productImgUrl = resp.imgUrl;
                    }
                    if (resp.result_code == 'FAIL') {
                        console.log(resp)
                    }
                })
            };

            //轮播图片上传
            $scope.lbImg_upload = function (files) {
                var data = new FormData();
                data.append('image', files[0]);
                ProductService.uploadImg(data).success(function (resp) {
                    if (resp.errmsg == '上传成功') {
                         $scope.productImage = {
                             url:null,
                             ProductId:$scope.productDetail.Id
                         };
                         $scope.img = {
                             imgName:null,
                             imgSrc:null,
                             imgDelSrc:null
                         };
                         $scope.img.imgName = resp.imgUrl.split("/")[4];
                         $scope.img.imgSrc = baseImgServer + resp.imgUrl;
                         $scope.img.imgDelSrc = resp.imgUrl;
                         $scope.productImage.url = resp.imgUrl;
                         $scope.productImages.push($scope.productImage);
                         $scope.thumb.push($scope.img);
                    }
                    if (resp.result_code == 'FAIL') {
                        console.log(resp)
                    }
                })
            };

            //删除封面图片
            $scope.img_del = function (imgUrl) {
                ProductService.delUploadImg(imgUrl).success(function (resp) {
                    if (resp) {
                        $scope.productImgUrl = null;
                        $scope.thumbTemp = [];
                        $scope.productImages = [];
                        for (var i = 0; i < $scope.thumb.length; i++) {
                            if ($scope.thumb[i].imgName != img.imgName) {
                                $scope.productImage = {
                                    url: null,
                                    ProductId: $scope.productDetail.Id
                                };
                                $scope.productImage.url = $scope.thumb[i].imgDelSrc;
                                $scope.productImages.push($scope.productImage);
                                $scope.thumbTemp.push($scope.thumb[i]);
                            }
                        }
                        $scope.thumb = $scope.thumbTemp;
                    }
                });
            };

            //更新
            $scope.update = function () {
                $scope.productDetail.Content = $('#summernote_sp').summernote('code');
                ProductService.update($scope.productDetail).success(function (resultJson) {
                    alert("更新成功");
                    window.history.back();
                }).error(function (e) {
                    console.log('系统异常');
                });
            }

        }
    ]);
});