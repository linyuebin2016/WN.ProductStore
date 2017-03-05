define(['app',
    "services/DateService"
], function (app) {

    var deps = ["$filter", "DateService"];

    /**
     * 1分钟内更新的动态显示为: “刚刚”, 如果isAlwaysShowTime 为true, 则不显示这个值
     * 1小时内更新的动态显示为: “n分钟前”, 如果isAlwaysShowTime 为true, 则不显示这个值
     * 1小时（含）前显示: 具体更新的时间, HH:mm
     * 1天以上（含）显示: X月X日+时间,
     * 跨年显示: X年X月X日 +时间
     * @returns {Function}
     */
    function filter($filter, DateService) {
        var dateFilter = $filter("date");
        return function (input, isAlwaysShowTime, isShorterDate) {
            if (!input) {
                return "";
            }

            var date = DateService.getDate(input);
            var now = new Date();
            // 和当前时间的分钟差
            var diff = (now.getTime() - date.getTime()) / 60000;

            //今天零点
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            // 今天零点和现在的分钟差
            var todayFar = (now.getTime() - today.getTime()) / 60000;

            if (!isAlwaysShowTime && diff < 1) {
                // 1分钟内
                return "刚刚";
            }
            if (!isAlwaysShowTime && diff < 60) {
                // 1小时内
                return parseInt(diff) + "分钟前";
            }

            if (diff < todayFar) {
                // 今天内, 1小时（含）前
                return dateFilter(date, "HH:mm");
            }

            if (isShorterDate) {
                // 1 天有1440 分钟
                if (diff < (todayFar + 1440)) {
                    return "昨天";
                }
                return dateFilter(date, "yy/M/d");
            }

            if (now.getFullYear() === date.getFullYear()) {
                // 1天以上（含）, 同年
                return dateFilter(date, "M月d日 HH:mm");
            }

            // 1天以上（含）, 跨年
            return dateFilter(date, "yyyy年M月d日 HH:mm");
        };
    }

    filter.$inject = deps;
    app.lazy.filter('noticeMoment', filter);
});