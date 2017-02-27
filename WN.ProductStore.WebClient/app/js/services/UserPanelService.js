/**
 * Created by denglingcong on 14-8-25.
 */

define(["app"], function(app) {
	
	function service() {

        var callbacks = {};

		return {
			on : function(event,callback) {
                 callbacks[event] = callback;
			},

            doit : function(event,config){
                if(callbacks[event]){
                    callbacks[event](config);
                }
            }
		};
	}

	app.lazy.service("UserPanelService", service);
});
