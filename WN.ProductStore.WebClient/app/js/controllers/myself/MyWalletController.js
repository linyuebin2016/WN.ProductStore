/**
 * Created by chenweizhi2 on 2017/2/24.
 */
define(["app",
    "directives/Notice"
], function(app) {

    "use strict";

    var deps = ["$scope", "$state"];

    function controller($scope, $state) {

    }

    controller.$inject = deps;
    app.lazy.controller("MyWalletController", controller);
});
