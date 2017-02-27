define(['app',
    "services/DateService"
], function (app) {

    var deps = ["$filter", "DateService"];

    /**
     * 1分钟内更新的动态显示为: “刚刚”
     * 1小时内更新的动态显示为: “n分钟前”
     * 24小时（含）前显示: “n小时前”
     * 1天（含）前显示: “昨天”
     * 7天（含）前显示: “n天前”
     * 1-4周（含）前显示: “n周前”
     * 1-2个月（含）前显示: “1个月前”
     * 3个月以上（含）前显示: “3个月前”
     * @returns {Function}
     */
    function filter($filter, DateService) {
        var dateFilter = $filter("date");
        return function (input) {
            if (!input) {
                return "";
            }

            var date = DateService.getDate(input);

            var now = new Date();
            // 和当前时间的分钟差
            var diffMinute = (now.getTime() - date.getTime()) / 60000;
            //今天零点
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            // 今天零点和现在的分钟差
            var todayFar = (now.getTime() - today.getTime()) / 60000;

            if (diffMinute < 1) {
                // 1分钟内
                return "刚刚";
            }
            if (diffMinute < 60) {
                // 1小时内
                return parseInt(diffMinute) + "分钟前";
            }
            if (diffMinute < todayFar) {
                // 今天内, 1小时（含）前
                return parseInt(diffMinute / 60) + "小时前";
            }

            var diffHour = (now.getTime() - date.getTime()) / 60000 / 60;
            // 昨天零点和现在的小时差
            var yesterdayFar = (now.getTime() - today.getTime()) / 60000 / 60 + 24;

            if (diffHour < yesterdayFar) {
                // 1天（含）前
                return "昨天";
            }

            var diffDay = (now.getTime() - date.getTime()) / 60000 / 60 / 24;
            // 昨天零点和现在的天数差
            var weekFar = (now.getTime() - today.getTime()) / 60000 / 60 / 24 + 7;

            if (diffDay < weekFar) {
                // 7天（含）前显示
                return parseInt(diffDay) + "天前";
            }

            var diffWeek = (now.getTime() - date.getTime()) / 60000 / 60 / 24 / 7;
            // 昨天零点和现在的小时差
            var fourWeekFar = (now.getTime() - today.getTime()) / 60000 / 60 / 24 / 7 + 4;

            if (diffWeek < fourWeekFar) {
                // 1-4周（含）前显示
                return parseInt(diffWeek) + "周前";
            }

            var diffMonth = dateFilter(now, "yyyyMM") - dateFilter(date, "yyyyMM");
            if (diffMonth == 0) {
                // 相差未满1个月显示: “4周前”
                return "4周前";
            }
            if (diffMonth < 3) {
                // 1-2个月（含）前显示: “1个月前”
                return parseInt(diffMonth) + "个月前";
            }
            if (diffMonth >= 3) {
                // 3个月以上（含）前显示: “3个月前”
                return "3个月前";
            }

        };
    }

    filter.$inject = deps;
    app.lazy.filter('moment', filter);
});