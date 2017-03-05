define(['app'], function (app) {

	var deps = ["$filter"];
	
	function timeLine($filter){
        var dateFilter = $filter("date");

		return function(input) {
			if(input == null) {
				return null;
			}
			var today = dateFilter(new Date(), "yyyy-MM-dd");
			var dd = new Date(); 
				dd.setDate(dd.getDate()-1);
			var yesterday = dateFilter(dd, "yyyy-MM-dd");
			if (input == today) {
				return "今天";
			} else if (input == yesterday) {
				return "昨天";
			} else {
				return input;
			}
	    };
	}
	
	timeLine.$inject = deps;
	
    app.lazy.filter('TimeLine', timeLine);
});