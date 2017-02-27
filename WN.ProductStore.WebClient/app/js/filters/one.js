define(['app'], function (app) {

    var deps = ['$filter'];

    var regexp = new RegExp('[^\u4e00-\u9fa5]','g');

    /**
     * sample: content | cut:true:22:'...'
     * @returns {Function}
     */
    function filter($filter) {
        return function (value) {
            if (!value) return '';
            //max = parseInt(max, 2);
            value = value.replace(regexp,'');
            var len = value.length;

            value = value.substr(len -1, len);

            return value || '无';
        };
    }

    filter.$inject = deps;
    app.lazy.filter('one', filter);
});