require.config({
    paths: {
        "jquery": "lib/jquery-1.11.3",
        "angular": "lib/angular-1.4.8/angular.min",
        "angularResource": "lib/angular-1.4.8/angular-resource",
        "uiRoute": "lib/ui-route-0.2.15/angular-ui-router",
        "angularSanitize": "lib/angular-1.4.8/angular-sanitize.min",
        //"angularAnimate": "lib/angular-1.4.8/angular-animate.min",
        "angularCookies": "lib/angular-1.4.8/angular-cookies",
        "angularLocale": "lib/angular-1.4.8/i18n/angular-locale_zh-cn",
        "bootstrapUI": "lib/angularUI/ng-bootstrap/ui-bootstrap-tpls-0.12.1.min",
        "bootstrapJs": "lib/bootstrap.min",
        "bootstraptour": "lib/bootstrap-tour.min",
        "datepicker": "lib/datepicker/js/bootstrap-datetimepicker.min",
        "datepickerCn": "lib/datepicker/locales/bootstrap-datetimepicker.zh-CN",
        "jqueryUI": "lib/jqueryui/jquery-ui-1.10.3.custom.min",
        "jqueryUITouchPunch": "lib/jquery-ui-touch-punch/jquery.ui.touch-punch.min",
        // "jqueryQrcode": "lib/jquery-qrcode/jquery.qrcode.min",
        "uislider": "lib/uislider/slider",
        "moment": "lib/moment/moment",
        "websocket": "lib/websocket",
        "md5": "lib/md5/md5",
        "rsa": "lib/rsa/rsa",
        "jsbn": "lib/rsa/jsbn",
        "rng": "lib/rsa/rng",
        "prng4": "lib/rsa/prng4",
        "des": "lib/crypto/tripledes",
        "crypto": "lib/crypto/core",
        "ecb": "lib/crypto/mode-ecb",
        "lodash": "lib/lodash/lodash",
        "postal": "lib/postal/postal",
        "jcrop": "lib/jcrop/jquery.Jcrop.min",
        "ngTable": "lib/table/ng-table",
        "ueditor": "lib/ueditor/ueditor.all.min",
        "ueditor.config": "lib/ueditor/ueditor.config.min",
        "angularUEditor": "lib/angular-ueditor/angular-ueditor.min",
        "spin": "lib/spin.js/spin.min",
        "webuploader": "lib/webuploader/webuploader",
        "IndexedDBShim": "lib/IndexedDBShim/IndexedDBShim",
        "jqueryIndexeddb": "lib/jquery-indexeddb/jquery.indexeddb",
        "caret": "lib/caret/jquery.caret",
        "ResizeSensor": "lib/ResizeSensor/ResizeSensor",
        "easing": "lib/rotate/jquery.easing.min",
        "rotate": "lib/rotate/jQueryRotate.2.2",
        "unslider": "lib/unslider/unslider-min",
        "pdfobject": "lib/pdfobject/pdfobject",
        "dragscrollable": "lib/dragscrollable/dragscrollable.min",
        "uirouterextras": "lib/ct-ui-router-extras.min",
        "ngDraggable": "lib/angular-1.4.8/ngDraggable",
        "emoji": "lib/emoji/emoji",
        "wx": "lib/jweixin-1.1.0",
        'uiSelect': 'lib/ui-select/select',
        'soundManager': 'lib/soundManager2/soundmanager2-min',
        'swiper' : 'lib/swiper.min',
        'jqueryWeUI' : 'lib/jquery-weui.min'
    },
    shim: {
        "angular": {
            "deps": ["jquery"],
            "exports": "angular"
        },
        "angularLocale": ["angular"],
        "uiRoute": ["angular"],
        "angularResource": ["angular"],
        "angularSanitize": ["angular"],
        //"angularAnimate": ["angular"],
        "angularCookies": ["angular"],
        "bootstrapUI": ["angular"],
        "bootstrapJs": ["jquery"],
        "datepicker": ["jquery"],
        "datepickerCn": ["datepicker"],
        "jqueryUI": ["jquery"],
        "jqueryUITouchPunch": ["jqueryUI"],
        "uislider": ["angular", "jqueryUI", "jqueryUITouchPunch"],
        "moment": {"exports": "moment"},
        'websocket': {'exports': 'YGWebSocket'},
        'ecb': ['des'],
        'jcrop': ['jquery'],
        'ngTable': ["angular"],
        'ueditor': ["angular", 'ueditor.config'],
        'angularUEditor': ["angular", "ueditor"],
        'webuploader': ['jquery'],
        'jqueryIndexeddb': ['jquery', 'IndexedDBShim'],
        'caret': ['jquery'],
        'ResizeSensor': {
            'deps': ['jquery'],
            'exports': 'ResizeSensor'
        },
        //'mCustomScrollbar': ['jquery', 'mousewheel'],
        'easing': ['jquery'],
        'rotate': ['jquery'],
        'dragscrollable': ['jquery'],
        'unslider': ['jquery'],
        'ngDraggable': ['angular'],
        'uiSelect': ['angular']
        //'mousewheel': ['jquery']
    },
    priority: [
        "jquery",
        "angular"
    ]
});

require(["app", "jquery", "nodeWebkit"], function (app, $, node) {
    $(document).ready(function () {
        if (window.requireNode) {
            node.requireNameConflict();
            node.initMemoryLeakWatchDog();
            node.initCrashDump();
            node.initExternalURLOpen();
            node.forbidDragAndDrop();
            node.buildTray();
            node.autoUpdateCheck();
            node.executeWinCmd();
        }
        window.runInBrowser = function (cb, error) {
            try {
                cb && cb();
            } catch (e) {
                error && error();
            } finally {
                return typeof global === "undefined"
            }
        }
        angular.bootstrap(document, [app.name]);
    });
});
