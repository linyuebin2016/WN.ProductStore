/**
 * Created by qiushaohua on 14-3-18.
 */
define(['app',
    'angular'
], function(app, angular) {

    var deps = [];

    var gui = null;
    var inBrowser = runInBrowser(function(){
        gui = require('nw.gui')
    });

    function Service() {
        return {
            getContextMenu: function(userId) {
                if (gui == null) {
                    return null;
                } else {
                    return {
                        cut : new gui.MenuItem({
                            label: "剪切",
                            click: function() {
                                document.execCommand("cut");
                            }
                        }),
                        copy : new gui.MenuItem({
                            label: "复制",
                            click: function() {
                                document.execCommand("copy");
                            }
                        }),
                        paste : new gui.MenuItem({
                            label: "粘贴",
                            click: function() {
                                document.execCommand("paste");
                            }
                        }),
                        selectAll : new gui.MenuItem({
                            label: "全选",
                            click: function() {
                                document.execCommand("selectAll");
                            }
                        })
                    }
                }
            }
        }
    }

    Service.$inject = deps;
    return app.lazy.service('EditorCommonService', Service);
});
