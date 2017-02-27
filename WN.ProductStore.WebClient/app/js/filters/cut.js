define(['app'], function (app) {

    var deps = ['$filter'];

    /**
     * sample: content | cut:true:22:'...'
     * @returns {Function}
     */
    function filter($filter) {
        return function (value, wordwise, max, tail) {
            if (!value) return '';
            //max = parseInt(max, 2);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    }

    filter.$inject = deps;
    app.lazy.filter('cut', filter);
});