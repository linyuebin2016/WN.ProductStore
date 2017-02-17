/**
 * Created by shengxiangyang on 2017-02-14.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductAMController', ['$scope','$http','$sce','$state','$stateParams','ProductService',
        function ($scope,$http,$sce,$state,$stateParams,ProductService) {

            $('.form_datetime').datetimepicker({
                minView: "month", //选择日期后，不会再跳转去选择时分秒
                language:  'zh-CN',
                format: 'yyyy-mm-dd',
                todayBtn:  1,
                autoclose: 1
            });

            $('.summernote').summernote({
                height: 300,
                lang: 'zh-CN',
                placeholder: '请输入内容...',
                disableDragAndDrop:true,
                //callbacks: {
                //    onImageUpload: function(files, editor, $editable) {
                //        sendFile(files);
                //    }
                //}
            });

            $scope.productDetail = {};
            var spid = $stateParams.spid;

            if (spid !=null && spid !="") {
                getProductDetail(spid);
            }

            function getProductDetail(spid) {
                ProductService.getProductDetail(spid).success(function (response) {
                    $scope.productDetail = response.Product;
                    $('#summernote_sp').summernote('code',$scope.productDetail.Content);
                    $scope.productDetail.Content = $sce.trustAsHtml($scope.productDetail.Content);
                });
            }

            $scope.save = function() {
                $scope.productDetail.Content = $('#summernote_sp').summernote('code');
                ProductService.saveProduct($scope.productDetail).success(function (resultJson) {
                    alert(resultJson + "新增成功");
                }).error(function (e) {
                    console.log('系统异常');
                });
            };

            function sendFile(files) {
                var data = new FormData();
                data.append("ajaxTaskFile", files[0]);
                $.ajax({
                    data : data,
                    type : "POST",
                    url : "http://10.52.0.87/ProductStroe/api/Image/ImgUpload",
                    cache : false,
                    contentType : false,
                    processData : false,
                    dataType : "json",
                    success: function(data) {
                        $('#summernote_sp').summernote('insertImage', data.data);
                    },
                    error:function(){
                        alert("上传失败");
                    }
                });
            }

            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.form = {     //用于绑定提交内容，图片或其他数据
                image:{}
            };
            $scope.thumb = {};      //用于存放图片的base64
            $scope.thumb_default = {    //用于循环默认的‘加号’添加图片的框
                1111:{}
            };

            $scope.img_upload = function(files) {       //单次提交图片的函数
                $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
                $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                $scope.reader.onload = function(ev) {
                    $scope.$apply(function(){
                        $scope.thumb[$scope.guid] = {
                            imgSrc : ev.target.result //接收base64
                        }
                    });
                };
                var data = new FormData();      //以下为像后台提交图片数据
                data.append('image', files[0]);
                data.append('guid',$scope.guid);

                ProductService.uploadImg(data).success(function(resp) {
                    if (resp.result_code == 'SUCCESS') {
                        $scope.thumb[$scope.guid] = {
                            imgSrc : "http://10.52.0.87/ProductStroe" + resp.imgUrl
                        };
                    }
                    if(resp.result_code == 'FAIL'){
                        console.log(resp)
                    }
                })
            };

            //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
            $scope.img_del = function(key) {
                var guidArr = [];
                for(var p in $scope.thumb){
                    guidArr.push(p);
                }
                delete $scope.thumb[guidArr[key]];
                delete $scope.form.image[guidArr[key]];
            };

        }
    ]);
});