/**
 * Created by qiushaohua on 14-5-8.
 */
define(["app"], function (app) {

    var deps = [];

    function service() {
        return {
            getDate: function (input) {
                return getDate(input);
            }
        };
    }

    var dateStringReg = /^(\d{4})-(\d{2})-(\d{2})( (\d{2})(:(\d{2})(:(\d{2}))?)?)?$/;

    function getDate(input) {
        if (typeof input === "number") {
            return new Date(input);
        }

        if (typeof input === "string") {
            var match = input.match(dateStringReg);
            if (match && match.length === 10) {
                // yyyy-MM-dd HH:mm:ss 的格式, match 为下面内容(每一个元素对应的部分), 每一个元素都是字符串,
                // match = [input, yyyy, MM, dd, HH:mm:ss, HH, :mm:ss, mm, :ss, ss];
                return new Date(match[1], match[2] - 1, match[3], match[5] || 0, match[7] || 0, match[9] || 0);
            }
        }

        return new Date(input);
    }

    service.$inject = deps;
    app.lazy.service("DateService", service);
});
