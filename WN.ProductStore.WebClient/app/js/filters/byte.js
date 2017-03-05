define([ 'app' ], function (app) {
    'use strict';

    var deps = [ '$filter' ];

    function filter($filter) {
        var kb = 1024;
        var mb = kb * kb;
        var numberFilter = $filter('number');

        return function (size) {
            if (size > mb) {
                return numberFilter(size / mb, 2) + ' MB';
            }
            if (size > kb) {
                return numberFilter(size / kb, 2) + ' KB';
            }
            return size + ' Bytes';
        };
    }

    filter.$inject = deps;
    return app.lazy.filter('byte', filter);
});
