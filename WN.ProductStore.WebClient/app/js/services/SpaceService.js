define(["app"], function(app) {
	
	var deps = ["$cookieStore"];
	
	function service($cookieStore) {
		return {
			setCurrentSpace : function(space) {
				$cookieStore.put("space", space);
			},
			
			getCurrentSpace : function() {
				return $cookieStore.get("space");
			},
			
			removeCurrentSpace : function() {
				$cookieStore.remove("space");
			},

            upSetCurrentSpace : function(space){
                $cookieStore.remove("space");
                $cookieStore.put("space", space);
            }
		};
	}
	
	service.$inject = deps;
	app.lazy.service("SpaceService", service);
});
