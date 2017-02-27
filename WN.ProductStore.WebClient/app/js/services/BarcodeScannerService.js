/**
 * Created by chenweizhi2 on 2017/2/10.
 */

define(['app',
    'services/WeChatJSSDKService',
    "services/WebAppService"
], function (app) {

    var deps = ['$q', 'WeChatJSSDKService', 'WebAppService'];

    function Service($q, WeChatJSSDKService, WebAppService) {

        // 二维码扫描：默认调用微信接口扫描，app下自动使用Cordova接口
        function scan() {
            var defer = $q.defer();

            if (WebAppService.isWebApp()) {
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if (!result.cancelled) {
                                defer.resolve({result: result.text});
                            }
                            else {
                                defer.reject({errorMsg: "用户拒绝授权获取相机"});
                            }
                        },
                        function (error) {
                            defer.reject({errorMsg: "用户拒绝授权获取相机"});
                        },
                        {
                            preferFrontCamera: false, // iOS and Android
                            showFlipCameraButton: false, // iOS and Android
                            showTorchButton: false, // iOS and Android
                            torchOn: false, // Android, launch with the torch switched on (if available)
                            prompt: "请将二维码置入扫描框", // Android
                            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                            disableAnimations: true, // iOS
                            disableSuccessBeep: false // iOS
                        }
                    );
                }
            }
            else {
                var apiList = ["scanQRCode"];
                WeChatJSSDKService.JSSDKConfig(apiList).then(
                    function (wx) {
                        wx.scanQRCode({
                            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                            success: function (res) {
                                defer.resolve({result: res.resultStr});
                            }, cancel: function (res) {
                                defer.reject({errorMsg: "用户拒绝授权获取相机"});
                            }
                        });
                    });
            }
            return defer.promise;
        }

        return {
            scan: function () {
                return scan();
            }
        };
    }

    Service.$inject = deps;
    app.lazy.service("BarcodeScannerService", Service);
});