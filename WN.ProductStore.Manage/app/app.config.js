define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');

    var app = angular.module('app', ['ui.router']);

    /**基本api路径 */
    app.value('baseUrl', 'http://10.52.0.87/ProductStore/api');

    asyncLoader.configure(app);
    module.exports = app;
});