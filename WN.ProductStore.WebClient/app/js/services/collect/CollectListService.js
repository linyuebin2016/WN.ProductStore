/**
 * Created by zhuyunfeng on 16-11-11.
 */
define(["app",
    'resources/CollectListResource',
    'services/BaseService',
    'services/UserService'
], function(app) {

    var deps = ["$rootScope", "$modal", "CollectListResource", "BaseService", "UserService"];

    var configWin;

    function CollectListService($rootScope, $modal, CollectListResource, BaseService, UserService) {
        return {
            
        };
    }

    CollectListService.$inject = deps;
    app.lazy.service("CollectLIstService", CollectListService);
});
