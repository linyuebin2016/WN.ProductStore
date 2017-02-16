/**
 * Created by shengxiangyang on 2017-02-14.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductAMController', ['$scope','$state','$stateParams','ProductService',
        function ($scope,$state,$stateParams,ProductService) {

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
                callbacks: {
                    onImageUpload: function(files, editor, $editable) {
                        sendFile(files);
                    }
                }
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

            function sendFile(files, editor, $editable) {
                var data = new FormData();
                data.append("ajaxTaskFile", files[0]);
                $.ajax({
                    data : data,
                    type : "POST",
                    url : "api/Upload/ImgUpload", //图片上传出来的url，返回的是图片上传后的路径，http格式
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

        }
    ]);
});