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
            //商品view
            $scope.ProductView = {
                Product:{},
                ProductImages:[]
            };
            //轮播图片对象、集合
            $scope.ProductImages = [];
            $scope.ProductImage = {
                Url:'',
                ProductId:''
            };

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
                    $scope.productImgUrl = $scope.productDetail.ImageUrl;
                    if(response.ProductImages.length>0){
                        for(var i=0;i<response.ProductImages.length;i++){
                            $scope.ProductImage = {
                                Url:'',
                                ProductId:''
                            };
                            $scope.ProductImage.Url = response.ProductImages[i].Url;
                            $scope.ProductImage.ProductId = $scope.productDetail.Id;
                            $scope.ProductImages.push($scope.ProductImage);
                        }
                    }
                });
            }

            //保存
            $scope.save = function () {
                $scope.productDetail.Content = $('#summernote_sp').summernote('code');
                $scope.productDetail.ImageUrl = $scope.productImgUrl;
                $scope.ProductView.Product = $scope.productDetail
                $scope.ProductView.ProductImages = $scope.ProductImages;
                ProductService.saveProduct($scope.ProductView).success(function (resultJson) {
                    alert(resultJson + "新增成功");
                    document.getElementById('publish_btn').disabled = true;
                    $state.go("product");
                }).error(function (e) {
                    console.log('系统异常');
                });
            };

            //封面图片上传
            $scope.fmImg_upload = function (files) {
                if ($scope.productImgUrl && $scope.productImgUrl.length > 0){
                    alert("只允许上传1张图片");
                    return;
                }
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
                if ($scope.productImages.length == 4){
                    alert("最多允许上传4张图片");
                    return;
                }
                var data = new FormData();
                data.append('image', files[0]);
                ProductService.uploadImg(data).success(function (resp) {
                    if (resp.errmsg == '上传成功') {
                         $scope.ProductImage = {
                             Url:'',
                             ProductId:''
                         };
                         $scope.ProductImage.Url = resp.imgUrl;
                         $scope.ProductImages.push($scope.ProductImage);
                    }
                    if (resp.result_code == 'FAIL') {
                        console.log(resp)
                    }
                })
            };

            //删除封面图片
            $scope.img_del = function (img,type) {
            		if(type == 1){
            			$scope.imgUrl = img;
            		} else {
            			$scope.imgUrl = img.Url
            		}
                ProductService.delUploadImg($scope.imgUrl).success(function (resp) {
                    if (resp) {
                    	if(type == 1){
                    			$scope.productImgUrl = null;
                    	}else {
                    		$scope.thumbTemp = [];
                            for (var i = 0; i < $scope.ProductImages.length; i++) {
                                if ($scope.ProductImages[i].Url != img.Url) {
                                    $scope.ProductImage = {
                                        Url: null,
                                        ProductId: $scope.productDetail.Id
                                    };
                                    $scope.ProductImage.Url = $scope.ProductImages[i].Url;
                                    $scope.thumbTemp.push($scope.ProductImages[i]);
                                }
                            }
                            $scope.ProductImages = $scope.thumbTemp;
                    	}
                    }
                });
            };

            //更新
            $scope.update = function () {
                $scope.productDetail.Content = $('#summernote_sp').summernote('code');
                $scope.productDetail.ImageUrl = $scope.productImgUrl;
                $scope.ProductView.Product = $scope.productDetail
                $scope.ProductView.ProductImages = $scope.ProductImages;
                ProductService.update($scope.ProductView).success(function (resultJson) {
                    alert("更新成功");
                    document.getElementById('update_btn').disabled = true;
                    $state.go("product");
                }).error(function (e) {
                    console.log('系统异常');
                });
            }

        }
    ]);
});