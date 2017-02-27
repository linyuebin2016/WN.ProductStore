/**
 * 用户图像编辑
 */
define(["app",
    "jcrop",
    "services/TipsService",
    "services/BaseService",
    "services/UserService"
], function(app) {

    var deps = ["TipsService", "$timeout", "$http", "$location", "BaseService", "UserService"];

    function directive(TipsService, $timeout, $http, $location, BaseService, UserService) {
        return {
            templateUrl: "views/usersetting/UserPicSetting.html",
            replace: true,
            scope: {
                type: "@",
                infoTab: '=',
                imageTab: '='
            },
            link: function($scope) {
                $scope.currentUser = UserService.getCurrentUser() || {};
                initAction($scope, BaseService, TipsService, $location, $timeout, $http, UserService);
            }
        };
    }


    function initAction($scope, BaseService, TipsService, $location, $timeout, $http, UserService) {

        /**选择文件**/
        $scope.changeImg = function(obj) {
            if (!obj || !obj.files || obj.files.length == 0) {
                TipsService.show('请选择文件');
                return;
            }
            var files = obj.files;
            var imageType = /image.*/;
            if (!files[0].type.match(imageType)) {
                TipsService.show('请选择图片类型的文件');
                return;
            }

            $scope.imgFile = files[0];
            $scope.$apply();

            //读取文件，并显示
            var reader = new FileReader();
            reader.onload = function(event) {
                $scope.imgSrc = event.target.result;
                initImgAndCrop($scope);
            };
            reader.readAsDataURL($scope.imgFile);

        };

        /**上传文件**/
        $scope.uploadUserPic = function() {
            var fd = new FormData();
            fd.append("file", $scope.imgFile);

            var urlParam = {
                cropX: ($scope.cropX ? $scope.cropX : 0),
                cropY: ($scope.cropY ? $scope.cropY : 0),
                cropW: ($scope.cropW ? $scope.cropW : 0),
                cropH: ($scope.cropH ? $scope.cropH : 0)
            };

            if ($scope.type == "self") {
                $http.post(BaseService.restfulUrl + "fileUploadController/saveUserPic?" + $.param(urlParam), fd, {
                    transformRequest: angular.identity,
                    transformResponse: function(resp) {
                        return {
                            fileId: resp
                        };
                    },
                    headers: {
                        "Content-Type": undefined
                    }
                }).success(function(resp) {
                    var userImageUrl = BaseService.restfulUrl + "userimage/" + $scope.currentUser.userId + "?t=" + new Date().getTime();
                    $scope.$emit("event.uploaduserImage.done", userImageUrl);
                    $scope.infoTab.active = true;
                    $scope.imageTab.active = false;
                    TipsService.show('头像更改成功');
                    cleanData($scope);
                    fd = {};
                    UserService.updateCurrentUser('userPicId', resp.fileId);
                });
            } else if ($scope.type == "topic") {
                $http.post(BaseService.restfulUrl + "fileUploadController/saveGroupPic?" + $.param(urlParam), fd, {
                    transformRequest: angular.identity,
                    transformResponse: function(resp) {
                        return {
                            fileId: resp
                        };
                    },
                    headers: {
                        "Content-Type": undefined
                    }
                }).success(function(resp) {
                    TipsService.show('头像更改成功');
                    cleanData($scope);
                    fd = {};
                    $scope.$emit("event.uploadtopicImage.done", resp);
                });
            }
        };
    }

    function initImgAndCrop($scope) {
        //更改图片地址，等全部图片加载完，进行初始化
        var $imgs = $(".userPicOrigin");

        if ($imgs && $imgs.length > 0) {
            for (var i = 0; i < $imgs.length; i++) {
                //更改选择的图片同时去掉上一个选择文件的长宽值，否则会影响到下一个选择的图片展示
                //                if($($imgs[i]).attr('id') == 'userPicCrop'){
                $($imgs[i]).css({
                    width: 'auto',
                    height: 'auto'
                });
                //                }
                $imgs[i].src = $scope.imgSrc;
            }
        }

        var imgNum = $imgs.length;
        $imgs.on("load", function() {
            if (!--imgNum) {
                initCrop($scope);
            }
        });
    }

    function cleanData($scope) {
        $scope.imgSrc = null;
        $scope.imgFile = null;
        $("#hideOriginalImg").attr("src", "");
        $("#userPicCrop").attr("src", "");
        $("#userPicCropBig").attr("src", "");
        $("#userPicCropMiddle").attr("src", "");
        $("#userPicCropSmall").attr("src", "");
    }

    function initCrop($scope) {
        if ($scope.jcrop_api) {
            $scope.jcrop_api.destroy();
        }

        $(function() {

            //图片框尺寸
            var maxHeight = 300,
                maxWidth = 400;

            //编辑区图片尺寸
            var BoundW,
                BoundH,
                //crop编辑区
                $jcropHolder;

            //大中小图片显示区

            var bigPic = {
                width: 180,
                height: 180,
                img: $("#userPicCropBig")
            };

            var middlePic = {
                width: 90,
                height: 90,
                img: $("#userPicCropMiddle")
            };

            var smallPic = {
                width: 60,
                height: 60,
                img: $("#userPicCropSmall")
            };

            //原图的宽高
            var $hideOriginalImg = $("#hideOriginalImg");
            var originImgW = $hideOriginalImg.width();
            var originImgH = $hideOriginalImg.height();
            var originMinSize = Math.min(originImgW,originImgH) / 10;

            //原图放在编辑区后缩放的比例
            var scale;


            $('#userPicCrop').Jcrop({
                onChange: updatePreview,
                onSelect: updatePreview,
                onRelease: reSetCrop,
                aspectRatio: 1,
                allowSelect: false,
                minSize: [originMinSize, originMinSize]
            }, function() {

                var bounds = this.getBounds();
                BoundW = bounds[0];
                BoundH = bounds[1];

                $jcropHolder = $(".jcrop-holder");

                //不能全部铺满图框，控制居中
                if (BoundW < maxWidth || BoundH < maxHeight) {
                    $jcropHolder.css({
                        top: "50%",
                        left: "50%",
                        marginLeft: "-" + (BoundW / 2) + "px",
                        marginTop: "-" + (BoundH / 2) + "px"
                    });
                }

                //操作crop的api
                $scope.jcrop_api = this;

                //编辑区图片相对于原图的比例
                scale = BoundW / originImgW;

                reSetCrop();

                $scope.jcrop_api.animateTo([0, 0, BoundW, BoundH]);
            });

            /**
             * 刷新预览
             * @param crop
             */
            function updatePreview(crop) {

                if (parseInt(crop.w) > 0) {
                    /**按照原图尺寸大小得出的实际截图框位置和大小，传到后台用于截取图片**/
                    $scope.cropX = Math.round(crop.x / scale);
                    $scope.cropY = Math.round(crop.y / scale);
                    $scope.cropW = Math.round(crop.w / scale);
                    $scope.cropH = Math.round(crop.h / scale);

                    refreshView(bigPic, crop);
                    refreshView(middlePic, crop);
                    refreshView(smallPic, crop);
                }
            }

            /**
             * 释放选择框,重置并初始化数据
             */
            function reSetCrop() {
                $scope.cropX = 0;
                $scope.cropY = 0;
                $scope.cropW = 0;
                $scope.cropH = 0;

                //重置预览区，默认为 原图上传，所以预览应该是原图上传情况下的头像
                originView(bigPic);
                originView(middlePic);
                originView(smallPic);
            }

            /**
             * 更新大中小三个图片框的图片显示
             **/
            function refreshView(picObj, crop) {

                //大中小显示框相对于编辑框的尺寸比例
                var rx = picObj.width / crop.w;
                var ry = picObj.height / crop.h;

                picObj.img.css({
                    width: Math.round(rx * BoundW) + 'px',
                    height: Math.round(ry * BoundH) + 'px',
                    marginLeft: '-' + Math.round(rx * crop.x) + 'px',
                    marginTop: '-' + Math.round(ry * crop.y) + 'px'
                });
            }


            //原图下的预览
            function originView(picObj) {
                picObj.img.css({
                    width: picObj.width,
                    height: picObj.height,
                    marginLeft: '0px',
                    marginTop: '0px'
                });
            }
        });
    }



    directive.$inject = deps;
    return app.lazy.directive("fcUserPicSetting", directive);
});
