/**
 * Created by shengxiangyang on 2017-02-13.
 */
require.config({
    baseUrl: './',
    paths: {
        'jquery': 'common/jquery/dist/jquery-1.11.1.min',
        'bootstrap': 'common/bootstrap/dist/js/bootstrap',
        'angular': 'common/angular/angular.min',
        'router': 'common/angular-route/angular-route',
        'angular-async-loader': 'common/angular-async-loader/angular-async-loader.min',
        'angular-ui-router': 'common/angular-ui-route/angular-ui-router',
        'angular-animate': 'common/angular-animate/angular-animate',
        'angular-resource': 'common/angular-resource/angular-resource',
        'jquery-knob': 'common/jQuery-Knob/js/jquery.knob'
    },
    shim: {
        'bootstrap':{
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'angular': {
            deps: ['jquery','bootstrap','jquery-knob'],
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'jquery-knob': {
            deps: ['jquery']
        }
    }
});
require(['angular', './app-routes'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});

