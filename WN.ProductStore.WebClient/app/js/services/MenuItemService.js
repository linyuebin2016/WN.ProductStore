/**
 * Created by qiushaohua on 14-3-18.
 */
define(['app',
    'services/NativeService'
], function (app) {

    var deps = ['NativeService'];


    function service(NativeService) {
        var win = NativeService.win;
        var gui = NativeService.gui;
        return {
            getMenu: function(){
                return new gui.Menu();
            },
            copyMenuItem: function(text){
                var clipboard = gui.Clipboard.get();
                return new gui.MenuItem({
                    type: 'normal',
                    label: '复制',
                    click: function() {
                        if (text && clipboard) {
                            if (typeof text === "object") {
                                // 复制组织信息
                                var orgs = text.userOrg && text.userOrg[0].orgName.split(' / ');
                                var postName = text.userOrg[0].postName || "";
                                text = ""
                                orgs.forEach(function(org){
                                    text += org +"\\"
                                })
                                text += postName;
                            }
                            clipboard.clear();
                            clipboard.set(text, 'text');
                        }
                    }
                })
            }
        };
    }

    service.$inject = deps;
    return app.lazy.service('MenuItemService', service);
});
