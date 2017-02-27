/**
 * Created by xiaojianyong on 2016/12/22.
 */
define(['app',
    "services/WeChatJSSDKService",
], function (app) {

    var deps = ['$q',"WeChatJSSDKService"];

    function service($q, WeChatJSSDKService) {
        return {
            getImgServerId : function(){
                //上传头像
                var apiList = ['chooseImage','previewImage','uploadImage'];
                var localIds = [];
                var serverId = '';
                var defer = $q.defer();
                WeChatJSSDKService.JSSDKConfig(apiList).then(function(wx){
                    wx.chooseImage({
                        scene: 1 | 2,
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            wx.uploadImage({
                                localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    serverId = res.serverId; // 返回图片的服务器端ID
                                    localIds = [];
                                    defer.resolve(serverId);
                                }
                            });
                            defer.resolve(serverId);
                        }
                    });
                });
                return defer.promise;
            }
        }
    }

    service.$inject = deps;
    app.lazy.service("WeChatImgService", service);
});