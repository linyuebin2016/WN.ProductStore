/**
 * Created by shengxiangyang on 2017-02-10.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('HomeController', ['$scope', function($scope) {
        $(function() {
            var match = document.cookie.match(new RegExp('color=([^;]+)'));
            if(match) var color = match[1];
            if(color) {
                $('body').removeClass(function (index, css) {
                    return (css.match (/\btheme-\S+/g) || []).join(' ')
                })
                $('body').addClass('theme-' + color);
            }

            $('[data-popover="true"]').popover({html: true});
        });
        $(function() {
            var uls = $('.sidebar-nav > ul > *').clone();
            uls.addClass('visible-xs');
            $('#main-menu').append(uls.clone());
        });
        $(function() {
            $(".knob").knob();
        });
    }]);
});
