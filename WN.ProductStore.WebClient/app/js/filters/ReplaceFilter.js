define(['app'], function (app) {

	var deps = [];
	
	function filter(){
		return function(input,para) {
			var keyValues = para.split(",");
			for (var i=0;i<keyValues.length;i++){
				//alert(keyValues[i]);
				var kvs = keyValues[i].split(":");
				if(kvs[0] == input){
					return kvs[1];
				}
			}
	    };
	}
	
	filter.$inject = deps;
	
    app.lazy.filter('ReplaceFilter', filter);
});