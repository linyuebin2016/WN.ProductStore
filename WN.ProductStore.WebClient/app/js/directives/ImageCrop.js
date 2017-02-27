/**
 * 图像编辑
 */
define(["app",
    "jquery",
    "jcrop",
    "services/TipsService"], function(app, $){
	
    var imageType = /image.*/;
	
	var deps = ["$timeout", "$q", "TipsService"];

	function directive($timeout, $q, TipsService) {
		return {
            templateUrl: "views/common/imagecrop/ImageCrop.html",
            replace: true,
            scope: {
            	url: "@?",
                sizes: "=?",
                aspectRatio: "@?",
                mustSelect: '@?'
            },
			link: function($scope, elem) {
				
				$scope.sizes = $scope.sizes || [{
					text: '大尺寸',
					width: 180,
					height: 180
				}, {
					text: '中尺寸',
					width: 90,
					height: 90
				}, {
					text: '小尺寸',
					width: 60,
					height: 60
				}];

                $scope.imgStyles = [];

                $scope.$watch('url', function urlWatcher() {
                    if ($scope.url) {
                        $scope.imgSrc = $scope.url;

                        resetImgStyle($scope);
                        tryInitCrop($scope, $timeout, $q, elem);
                    }
                });

                elem.find(".js-file-input").on('change', function() {
                    changeImg(this.files);
                });

                /** 选择文件* */
                function changeImg(files) {
                    if(!files || files.length === 0){
                        TipsService.show('请选择文件');
                        return;
                    }
                    if (!files[0].type.match(imageType)) {
                        TipsService.show('请选择图片类型的文件');
                        return;
                    }

                    $scope.imgFile = files[0];

                    // 读取文件，并显示
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        $scope.imgSrc = event.target.result;

                        resetImgStyle($scope);
                        $scope.$apply();

                        tryInitCrop($scope, $timeout, $q, elem);
                    };
                    reader.readAsDataURL($scope.imgFile);
                }
			}
		};
	}

    function resetImgStyle($scope) {
        for (var i = 0, len = $scope.sizes.length; i < len; i++) {
            $scope.imgStyles[i] = {
                width: 'auto',
                height: 'auto'
            };
        }
    }

    function tryInitCrop($scope, $timeout, $q, elem) {
        if($scope.jcrop_api){
            $scope.jcrop_api.destroy();
        }

        // 更改图片地址，等全部图片加载完，进行初始化
        var $imgs = elem.find("img");

        $imgs.attr('src', $scope.imgSrc);
        $imgs.filter('.js-crop-pic').css({
            width: 'auto',
            height: 'auto'
        });

        var promises = [];

        promises.push(resolveImgSize($scope, $q));

        $imgs.each(function(index, img) {
            var defer = $q.defer();

            img.onload = function() {
                defer.resolve();
            };

            promises.push(defer.promise);
        });

        $q.all(promises).then(function(datas) {
            initCrop($scope, $timeout, elem, datas[0]);
        });
    }

    function resolveImgSize($scope, $q) {
        var defer = $q.defer();
        var img = new Image();
        img.onload = function () {
            defer.resolve({
                width: img.width,
                height: img.height
            });
        };
        img.src = $scope.imgSrc;

        return defer.promise;
    }

    function initCrop($scope, $timeout, elem, originSize){
        // 图片框尺寸
        var maxHeight = 300,
            maxWidth = 400;

        // 编辑区图片尺寸
        var boundW;
        var boundH;
        // crop编辑区
        var $jcropHolder;

        // 原图放在编辑区后缩放的比例
        var scaleW;
        var scaleH;

        var jcropOption = {
            onChange: function (crop) {
                updatePreview(crop);
                $scope.$apply();
            },
            onSelect: function (crop) {
                updatePreviewAndPublish(crop);
                $scope.$apply();
            },
            onRelease: function () {
                resetCrop();
                $scope.$apply();
            },
            aspectRatio: parseFloat($scope.aspectRatio) || 1
        };

        if ($scope.mustSelect === 'true') {
            jcropOption.onRelease = function () {
                resetCrop();
                setInitSelect();
            };
        }

        elem.find('.js-crop-pic').Jcrop(jcropOption, function() {
        	
            var bounds = this.getBounds();
            boundW = bounds[0];
            boundH = bounds[1];

            $jcropHolder = elem.find(".jcrop-holder");

            // 不能全部铺满图框，控制居中
            if(boundW < maxWidth || boundH < maxHeight){
                $jcropHolder.css({
					top : "50%",
					left : "50%",
					marginLeft : "-" + (boundW / 2) + "px",
					marginTop : "-" + (boundH / 2) + "px"
                });
            }

            // 操作crop的api
            $scope.jcrop_api = this;

            // 编辑区图片相对于原图的比例
            scaleW = boundW / originSize.width;
            scaleH = boundH / originSize.height;

            resetCrop();
        });

        if ($scope.mustSelect === 'true') {
            setInitSelect();
        }

        /**
         * 设置初始的选择大小
         */
        function setInitSelect() {
            $timeout(function () {
                var w = boundW;
                var h = boundW / jcropOption.aspectRatio;
                if (h > boundH) {
                    w = boundH * jcropOption.aspectRatio;
                    h = boundH;
                }
                $scope.jcrop_api.setSelect([0, 0, w, h]);
            }, 0);
        }

        /**
		 * 刷新预览
		 * 
		 * @param crop
		 */
        function updatePreview(crop) {
            if (parseInt(crop.w) > 0) {
                refreshView(crop);
            }
        }

        function updatePreviewAndPublish(crop) {
            if (parseInt(crop.w) > 0) {
                publish({
                    /** 按照原图尺寸大小得出的实际截图框位置和大小，传到后台用于截取图片* */
                    cropX: Math.round(crop.x / scaleW),
                    cropY: Math.round(crop.y / scaleH),
                    cropW: Math.round(crop.w / scaleW),
                    cropH: Math.round(crop.h / scaleH)
                });

                refreshView(crop);
            }
        }

        /**
		 * 释放选择框,重置并初始化数据
		 */
        function resetCrop(){
            publish({
            	cropX: 0,
                cropY: 0,
                cropW: 0,
                cropH: 0
            });

            // 重置预览区，默认为 原图上传，所以预览应该是原图上传情况下的头像
            originView();
        }
        
        function publish(cropSize) {
        	$scope.$bus.publish({
                channel: 'image',
                topic: 'crop',
                data: $.extend({
                	file: $scope.imgFile
                }, cropSize)
            });
        }

        /**
		 * 更新大中小三个图片框的图片显示
		 */
        function refreshView(crop){
            for (var i = 0, len = $scope.sizes.length; i< len; i++) {
            	var rx = $scope.sizes[i].width / crop.w;
                var ry = $scope.sizes[i].height / crop.h;
                
        		$scope.imgStyles[i] = {
                    width: Math.round(rx * boundW),
                    height: Math.round(ry * boundH),
                    marginLeft: - Math.round(rx * crop.x),
                    marginTop: - Math.round(ry * crop.y)
                };
        	}
        }

        // 原图下的预览
        function originView(){
        	for (var i = 0, len = $scope.sizes.length; i < len; i++) {
        		$scope.imgStyles[i] = {
                    width: $scope.sizes[i].width,
                    height: $scope.sizes[i].height,
                    marginLeft: 0,
                    marginTop: 0
                };
        	}
        }
    }

	directive.$inject = deps;
	return app.lazy.directive("fcImageCrop", directive);
});