define(['app'], function (app) {

	var deps = ["$filter"];

	function fromNowFun($filter){
        var dateFilter = $filter("date");

        return function(input) {
            if(input == null) {
                return null;
            }
			var today = dateFilter(new Date(), "yyyy-MM-dd");
			var day = input.split(" ")[0],
				time = input.split(" ")[1];
			var arr = day.split("-"),
				year = arr[0],
				month = parseInt(arr[1])-1,
				d = arr[2];
			var arr2 = time.split(":"),
				hour = arr2[0],
				minute = arr2[1],
				second = arr2[2];
			if (day == today) {
				var todayTime = new Date().getTime(),
					inputTime;
				// 浏览器兼容处理
				if(navigator.userAgent.indexOf("Firefox") > 0){
					inputTime = new Date(year, month, d, hour, minute, second).getTime();
				} else if (navigator.userAgent.indexOf("Safari") > 0 && navigator.userAgent.indexOf("Chrome") < 0) {
					inputTime = new Date(year, month, d, hour, minute, second).getTime();
				} else if (navigator.userAgent.indexOf("MSIE 10.0") > 0) {
					inputTime = new Date(year, month, d, hour, minute, second).getTime();
				} else if (navigator.userAgent.indexOf("rv:11.0") > 0) {
					inputTime = new Date(year, month, d, hour, minute, second).getTime();
				} else {
					inputTime = new Date(input).getTime();
				}
				var withinTime = todayTime - inputTime;
				var leave1 = withinTime%(24*3600*1000);
				var minutes = Math.floor(leave1/(60*1000));
				if (minutes < 1) {
					return "刚刚";
				}
				if (minutes < 60) { // 小于60分则显示几分钟前
					return minutes + "分钟前";
				}
				if (minutes >= 60) { // 超过或等于60分显示具体时间
					return hour + ":" + minute;
				}
			}
            // 不是今天则显示具体时间
            return hour + ":" + minute;
        };
	}

	fromNowFun.$inject = deps;

    app.lazy.filter('FromNow', fromNowFun);
});