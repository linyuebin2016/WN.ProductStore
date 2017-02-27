define(['app'], function (app) {
	
	var deps = [];
	
	function formatPercent(){
		return function(input) {
			 if(input != null){
					var re = /\d+%/;	
					var percent = input.match(re);
					if(percent != null){
						input = input.replace(percent,"<span class='percent'>" +percent +"</span>");
					}
					
			 }
			

		   return input;
	    };
	}
	
	formatPercent.$inject = deps;
	
    app.lazy.filter('FormartPercent', formatPercent);
});