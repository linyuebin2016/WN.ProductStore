define(["app"], function(app) {

    var deps = ["$resource", "BaseService"];

    function resource($resource, BaseService) {
        var postHeader = {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        return $resource(BaseService.restfulUrl + "user", {}, {
            login: {
                method: "POST",
                url: BaseService.restfulUrl + "login",
                headers: postHeader
            },
            isNeedLoginCode: {
                method: "GET",
                url: BaseService.restfulUrl + "login/isNeedLoginCode/:userName"
            },
            logout: {
                method: "GET",
                url: BaseService.restfulUrl + "login/logout"
            },
            sendValidateCode: {
                method: "GET",
                url: BaseService.restfulUrl + "login/sendValidateCode"
            },
            checkValidateCode: {
                method: "GET",
                url: BaseService.restfulUrl + "login/checkValidateCode"
            },
            initPassword: {
                method: "GET",
                url: BaseService.restfulUrl + "login/initPassword",
                headers: postHeader
            },
            resetPassword: {
                method: "GET",
                url: BaseService.restfulUrl + "login/resetPassword",
                headers: postHeader
            },
            resetUserMobile: {
                method: "GET",
                url: BaseService.restfulUrl + "login/resetUserMobile",
                headers: postHeader
            },
            codeLogin: {
                method: "POST",
                url: BaseService.restfulUrl + "login/codeLogin",
                headers: postHeader
            },
            getJSSDKConfig: {
                method: "GET",
                url: BaseService.restfulUrl + "login/getJSSDKConfig",
                headers: postHeader
            },
            searchUserByUserName: {
                method: "GET",
                url: BaseService.restfulUrl + "user/selcetUsers",
                isArray: true
            },
            getUserIntegralRanking: {
                method: "GET",
                url: BaseService.restfulUrl + "user/getUserIntegralRanking",
                isArray: true
            },
            queryUserToReceiveRedPack: {
				method: "GET",
                url: BaseService.restfulUrl + "user/queryUserToReceiveRedPack",
                isArray: true
            }
        });
    }

    resource.$inject = deps;
    app.lazy.factory("UserResource", resource);
});
