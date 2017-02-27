define(["app", "jquery"], function (app, $) {

    var deps = ["$http", "BaseService"];

    function ConferenceResource($http, BaseService) {
        return initResource($http, "http://meeting.ismartwork.cn/conference/restful/");
        //return initResource($http, "http://10.1.5.37:8082/testconf/restful/");
    }

    var reqHeader = {
        "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl) {
        return {
        	queryUserPermission: function (userId, currentCompanyCode) {
            	return $http.get(preUrl + "user/queryUserPermission",{
                    params: {
                    	userId: userId,
                        currentCompanyCode: currentCompanyCode
                    }
            	 });
            },
        	createConferenceFromPc: function (createConferenceVo, TipsService) {
            	//return $http.post(preUrl + "voiceConference/createConferenceFromPc", angular.toJson(createConferenceVo));
                // 此处修改应知会小仲，userAgent判断
                $.ajax({
                    type: "POST",
                    url: preUrl + "voiceConference/createConferenceFromPc",
                    contentType: "application/json",  //发送信息至服务器时内容编码类型。
                    dataType: "text",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
                    data: JSON.stringify(createConferenceVo),
                    success: function(data){
                        TipsService.show("请接听手机畅会通或010区号来电...");
                    },
                    error: function(err){
                        TipsService.show("抱歉，请求失败...错误："+err);
                    }
                });
            }
        } ;
    }

    ConferenceResource.$inject = deps;
    return app.lazy.service("ConferenceResource", ConferenceResource);
});
