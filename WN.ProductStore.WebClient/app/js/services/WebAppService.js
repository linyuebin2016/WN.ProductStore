/**
 * Created by chenweizhi2 on 2017/2/16.
 */
define(['app'
], function (app) {

    var deps = [];

    function Service() {
        return {
            isWebApp: function () {
                // 判断是否有cordova对象，app专有
                var isApp = false;
                try {
                    if (cordova) {
                        isApp = true;
                    }
                } catch (e) {
                    isApp = false;
                } finally {

                }
                return isApp;
            }
        };
    }

    Service.$inject = deps;
    app.lazy.service("WebAppService", Service);
});