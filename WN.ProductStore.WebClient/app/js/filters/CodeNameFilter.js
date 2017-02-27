define(['app'], function (app) {

	var deps = [];
	
	function filter(){
		return function(input,para) {
			var arrInput = input ||[];
			for (var i=0;i<arrInput.length;i++){				
				if(arrInput[i].code == para){
					return arrInput[i].name;
				}
			}
			return para;
	    };
	}
	
	filter.$inject = deps;
	
    app.lazy.filter('CodeNameFilter', filter);
});