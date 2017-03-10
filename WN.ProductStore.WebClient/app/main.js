/**
 * Created by shengxiangyang on 2017-02-13.
 */
require.config({
    baseUrl: '',
    paths: {
        'jquery': 'lib/jquery/dist/jquery-2.1.4',
        'bootstrap': 'lib/bootstrap/dist/js/bootstrap.min',
        'angular': 'lib/angular/angular.min',
        'router': 'lib/angular-route/angular-route',
        "moment" : "lib/moment/moment",
        "ngTable" : "lib/table/ng-table",
        'angular-async-loader': 'lib/angular-async-loader/angular-async-loader.min',
        'angular-ui-router': 'lib/angular-ui-route/angular-ui-router',
        'angular-animate': 'lib/angular-animate/angular-animate',
        'angular-resource': 'lib/angular-resource/angular-resource',
        'datetimepicker': 'lib/datetimepicker/js/bootstrap-datetimepicker',
        'datetimepicker-cn':'lib/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
        'jqueryWeUI':'lib/jquery-weui/jquery-weui.min'
    },
    shim: {
        'bootstrap':{
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'angular': {
            deps: ['jquery','bootstrap'],
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'moment': {
            exports : "moment"
        },
        'ngTable' : {
            deps: ["angular"]
        },
        'datetimepicker': {
            deps:['bootstrap','jquery']
        },
        'datetimepicker-cn': {
            deps:['datetimepicker']
        },
        'angular-sanitize':{
            deps:['angular']
        }
    },
    deps:['moment','datetimepicker-cn']
});

require(['angular', './app-routes'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});

