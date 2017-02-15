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
                placeholder: 'type here...',
                onImageUpload: function(files, editor, $editable) {
                    sendFile(files[0],editor,$editable);
                }
            });

            function sendFile(file, editor, $editable){
                $(".note-toolbar.btn-toolbar").append('正在上传图片');
                var filename = false;
                try{
                    filename = file['name'];
                    alert(filename);
                } catch(e){filename = false;}
                if(!filename){$(".note-alarm").remove();}
                //以上防止在图片在编辑器内拖拽引发第二次上传导致的提示错误
                var ext = filename.substr(filename.lastIndexOf("."));
                ext = ext.toUpperCase();
                var timestamp = new Date().getTime();
                var name = timestamp+"_"+$("#summernote").attr('aid')+ext;
                //name是文件名，自己随意定义，aid是我自己增加的属性用于区分文件用户
                data = new FormData();
                data.append("file", file);
                data.append("key",name);
                data.append("token",$("#summernote").attr('token'));

                $.ajax({
                    data: data,
                    type: "POST",
                    url: "/summernote/fileupload", //图片上传出来的url，返回的是图片上传后的路径，http格式
                    contentType: "json",
                    cache: false,
                    processData: false,
                    success: function(data) {
                        //data是返回的hash,key之类的值，key是定义的文件名
                        alert(data);
                        //把图片放到编辑框中。editor.insertImage 是参数，写死。后面的http是网上的图片资源路径。
                        //网上很多就是这一步出错。
                        $('#summernote').summernote('editor.insertImage', "http://res.cloudinary.com/demo/image/upload/butterfly.jpg");

                        $(".note-alarm").html("上传成功,请等待加载");
                        setTimeout(function(){$(".note-alarm").remove();},3000);
                    },
                    error:function(){
                        $(".note-alarm").html("上传失败");
                        setTimeout(function(){$(".note-alarm").remove();},3000);
                    }
                });
            }

            $scope.productDetail = {};
            var spid = $stateParams.spid;

            if (spid !=null && spid !="") {
                getProductDetail(spid);
            }

            function getProductDetail(spid) {
                ProductService.getProductDetail(spid).success(function (response) {
                    $scope.productDetail = response.Product;
                });
            }
        }
    ]);
});