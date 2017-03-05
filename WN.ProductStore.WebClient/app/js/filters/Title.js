define(['app'], function (app) {

    var deps = ["$filter"];

    /**
     * 群组名标题过长处理
     * 
     * @returns {Function}
     */
    function filter($filter) {
        return function (input) {
            if (!input) {
                return "";
            }

            if(input.length > 9){
                return input.substr(0, 9) + "...";
            }

            return input;
        };
    }

    filter.$inject = deps;
    app.lazy.filter('title', filter);
});