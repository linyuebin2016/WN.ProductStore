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
                    url : "http://10.52.0.87/ProductStroe/api/Image/ImgUpload", //图片上传出来的url，返回的是图片上传后的路径，http格式
                    cache : false,
                    contentType : false,
                    processData : false,
                    dataType : "json",
                    success: function(data) {//data是返回的hash,key之类的值，key是定义的文件名
                        $('#summernote_sp').summernote('insertImage', data.data);
                    },
                    error:function(){
                        alert("上传失败");
                    }
                });
            }

            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.form = {     //用于绑定提交内容，图片或其他数据
                image:{},
            };
            $scope.thumb = {};      //用于存放图片的base64
            $scope.thumb_default = {    //用于循环默认的‘加号’添加图片的框
                1111:{}
            };

            $scope.img_upload = function(files) {       //单次提交图片的函数
                //第一种方法
                sendFile(files);
                var data = new FormData();      //以下为像后台提交图片数据
                data.append('image', files[0]);
                data.append('guid',$scope.guid);
                //第二种方法
                ProductService.uploadImg(data);
                //第三种方法
                $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
                $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                $scope.reader.onload = function(ev) {
                    $scope.$apply(function(){
                        $scope.thumb[$scope.guid] = {
                            imgSrc : ev.target.result,  //接收base64
                        }
                    });
                };

                $http({
                    method: 'post',
                    url: 'http://10.52.0.87/ProductStroe/api/Image/ImgUpload',
                    data:data,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).success(function(data) {
                    if (data.result_code == 'SUCCESS') {
                        $scope.form.image[data.guid] = data.result_value;
                        $scope.thumb[data.guid].status = 'SUCCESS';
                        console.log($scope.form)
                    }
                    if(data.result_code == 'FAIL'){
                        console.log(data)
                    }
                })
            };

            $scope.img_del = function(key) {    //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
                var guidArr = [];
                for(var p in $scope.thumb){
                    guidArr.push(p);
                }
                delete $scope.thumb[guidArr[key]];
                delete $scope.form.image[guidArr[key]];
            };
            $scope.submit_form = function(){    //图片选择完毕后的提交，这个提交并没有提交前面的图片数据，只是提交用户操作完毕后，
                $http({
                    method: 'post',
                    url: '/comm/test.php',
                    data:$scope.form,
                }).success(function(data) {
                    console.log(data);
                })
            };

        }
    ]);
});