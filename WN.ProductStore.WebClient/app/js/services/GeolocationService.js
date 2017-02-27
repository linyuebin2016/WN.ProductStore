/**
 * Created by chenweizhi2 on 2016/12/14.
 */
define(["app",
    "services/WeChatJSSDKService",
    "services/WebAppService"
], function (app) {

    var deps = ['$q', 'WeChatJSSDKService', 'WebAppService'];

    function GeolocationService($q, WeChatJSSDKService, WebAppService) {
        var currLocation = {
            latitude: '',
            longitude: '',
            address: ''
        };

        var options = {
            enableHighAccuracy: true,  // 是否使用 GPS
            maximumAge: 30000,         // 缓存时间
            timeout: 27000,            // 超时时间
            coorType: "bd09ll"         // 默认是 gcj02，可填 bd09ll 以获取百度经纬度用于访问百度 API
                                       // bd09ll（百度经纬度坐标）、gcj02ll（国测局经纬度坐标）、wgs84ll（ GPS经纬度）
        };

        // 位置获取：默认调用微信接口，app下自动使用Cordova接口
        function getLocation() {
            var defer = $q.defer();

            if (WebAppService.isWebApp()) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            currLocation.latitude = position.coords.latitude;
                            currLocation.longitude = position.coords.longitude;
                            //     getAddress(currLocation.latitude, currLocation.longitude).success(function (data) {
                            //         if (data.formatted_address)
                            //             currLocation.address = data.formatted_address;
                            //     });
                            defer.resolve(currLocation);
                        }, function (error) {
                            switch (error.code) {
                                case error.PERMISSION_DENIED:
                                    defer.reject({errorMsg: "定位失败,用户拒绝请求地理定位"});
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    defer.reject({errorMsg: "定位失败,位置信息是不可用"});
                                    break;
                                case error.TIMEOUT:
                                    defer.reject({errorMsg: "定位失败,请求获取用户位置超时"});
                                    break;
                                case error.UNKNOWN_ERROR:
                                    defer.reject({errorMsg: "定位失败,定位系统失效"});
                                    break;
                            }
                        }, options);
                }
                else {
                    defer.reject({errorMsg: "不支持获取地理位置服务"});
                }
            } else {
                var apiList = ["getLocation"];
                WeChatJSSDKService.JSSDKConfig(apiList).then(
                    function (wx) {
                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                // var speed = res.speed; // 速度，以米/每秒计
                                // var accuracy = res.accuracy; // 位置精度

                                currLocation.latitude = res.latitude;
                                currLocation.longitude = res.longitude;

                                defer.resolve(currLocation);
                            }
                            , cancel: function (res) {
                                defer.reject({errorMsg: "用户拒绝授权获取地理位置"});
                            }
                            , fail: function (res) {
                                defer.reject({errorMsg: "获取用户地理位置失败"});
                            }
                        });
                    });
            }
            return defer.promise;

            // var defer = $q.defer();
            // if (navigator.geolocation) {
            //     navigator.geolocation.getCurrentPosition(
            //         function (position) {
            //             currLocation.latitude = position.coords.latitude;
            //             currLocation.longitude = position.coords.longitude;
            //             //     getAddress(currLocation.latitude, currLocation.longitude).success(function (data) {
            //             //         if (data.formatted_address)
            //             //             currLocation.address = data.formatted_address;
            //             //     });
            //             defer.resolve(currLocation);
            //         }, function (error) {
            //             switch (error.code) {
            //                 case error.PERMISSION_DENIED:
            //                     defer.reject({errorMsg: "定位失败,用户拒绝请求地理定位"});
            //                     break;
            //                 case error.POSITION_UNAVAILABLE:
            //                     defer.reject({errorMsg: "定位失败,位置信息是不可用"});
            //                     break;
            //                 case error.TIMEOUT:
            //                     defer.reject({errorMsg: "定位失败,请求获取用户位置超时"});
            //                     break;
            //                 case error.UNKNOWN_ERROR:
            //                     defer.reject({errorMsg: "定位失败,定位系统失效"});
            //                     break;
            //             }
            //         }, options);
            // }
            // else {
            //     defer.reject({errorMsg: "您的浏览器不支持使用HTML5来获取地理位置服务"});
            // }
            // return defer.promise;
        }

        // function getAddress(latitude, longitude) {
        //     return $http.get("http://api.map.baidu.com/geocoder/v2/?ak=66Ub7uZ7Z6UEZkUku4YtUfhK2dY5zcu0&location="
        //         + latitude + "," + longitude
        //         + "&output=json&pois=1");
        // }

        return {
            getCurrentPosition: function () {
                return getLocation();
            }
        };
    }

    GeolocationService.$inject = deps;
    app.lazy.service("GeolocationService", GeolocationService);
});