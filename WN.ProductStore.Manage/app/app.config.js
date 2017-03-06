define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');

    var app = angular.module('app', ['ui.router']);
    var baseServer = "http://10.52.0.87";
    /**基本api路径 */
    app.value('baseUrl', baseServer + '/ProductStore/api');
    app.value('baseImgServer', baseServer + '/ProductStore/');

    asyncLoader.configure(app);
    module.exports = app;
});