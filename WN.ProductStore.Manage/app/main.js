/**
 * Created by shengxiangyang on 2017-02-13.
 */
require.config({
    baseUrl: '',
    paths: {
        'jquery': 'common/jquery/dist/jquery-1.11.1.min',
        'bootstrap': 'common/bootstrap/dist/js/bootstrap.min',
        'angular': 'common/angular/angular.min',
        'router': 'common/angular-route/angular-route',
        "moment" : "common/moment/moment",
        "ngTable" : "common/table/ng-table",
        'angular-async-loader': 'common/angular-async-loader/angular-async-loader.min',
        'angular-ui-router': 'common/angular-ui-route/angular-ui-router',
        'angular-animate': 'common/angular-animate/angular-animate',
        'angular-resource': 'common/angular-resource/angular-resource',
        'datetimepicker': 'common/datetimepicker/js/bootstrap-datetimepicker',
        'datetimepicker-cn':'common/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
        'ueditor':'common/ueditor/summernote.min',
        'ueditor-cn':'common/ueditor/lang/summernote-zh-CN.min'
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
        'ueditor': {
            deps:['bootstrap','jquery']
        },
        'ueditor-cn':{
            deps:['ueditor']
        },
        'angular-sanitize':{
            deps:['angular']
        }
    },
    deps:['moment','datetimepicker-cn','ueditor-cn']
});

require(['angular', './app-routes'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});

