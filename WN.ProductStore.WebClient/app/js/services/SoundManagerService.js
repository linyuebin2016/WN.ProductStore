/**
 * Created by chenweizhi2 on 2017/1/12.
 */
define(['app',
    'services/TipsService'
], function (app) {

    var deps = ["$rootScope", "$q", "TipsService"];

    function Service($rootScope, $q, TipsService) {
        return {
            init: function () {
                var defer = $q.defer();
                if ($rootScope.SoundManager) {
                    angular.forEach($rootScope.SoundManager.soundIDs, function (value, key) {
                        $rootScope.SoundManager.destroySound(value);
                    });
                    // .reboot();
                    defer.resolve($rootScope.SoundManager);
                }
                else {
                    soundManager.setup({
                        url: '../lib/soundManager2/swf/',
                        waitForWindowLoad: true,
                        onready: function () {
                            $rootScope.SoundManager = soundManager;
                            defer.resolve($rootScope.SoundManager);
                        },
                        ontimeout: function () {
                            var errorMsg = "不支持HTML5,阻止使用flash";
                            defer.reject(errorMsg);
                            TipsService.show(errorMsg);
                        }
                    });
                }

                return defer.promise;
            }
        };
    }

    Service.$inject = deps;
    app.lazy.service("SoundManagerService", Service);
});