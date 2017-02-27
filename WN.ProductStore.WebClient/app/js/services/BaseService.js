// var path = require("path");
/**菜单的配置信息**/
define(["app"], function (app) {
    app.lazy.service("BaseService", function () {
        return {
            //开发
            // restfulUrl: "http://10.51.122.23:8080/webapp/restful/",
            // webAppUrl: "http://10.51.122.23:8080/webapp/",
            // restfulUrl: "http://10.52.0.53:8080/webapp/restful/",
            // webAppUrl: "http://10.52.0.53:8080/webapp/",
            // restfulUrl: "http://10.52.0.89:8088/webapp/restful/",
            // 测试服
            restfulUrl: "http://93dev.ygsoft.com/webapp/restful/",
            webAppUrl: "http://93dev.ygsoft.com/webapp/",
            uploadUrl: "http://93dev.ygsoft.com/upload/",
            // 微信
            // restfulUrl: "restful/",
            // webAppUrl: "/",
            // 红包
            redPackageUrl: "http://93dev.ygsoft.com/webapp/html5/redpack/index.html#/",
            // redPackageUrl: "file:///" + path.resolve() + "/node_modules/redbag/resource/index.html#/",
            pdfViewUrl: "http://93dev.ygsoft.com/93home/js/lib/pdfjs/web/viewer.html",//这个不要删掉
            formHeader: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        }
    });
});
