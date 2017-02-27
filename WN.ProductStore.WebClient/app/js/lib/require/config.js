require.config({
	baseUrl : "/grm/community/js",
	paths : {
		"jquery" : "/grm/communitybase/js/jquery-1.10.2.min",
		"angular" : "/grm/communitybase/js/angular/angular.min",
		"angularSanitize" : "/grm/communitybase/js/angular/angular-sanitize.min",
		"ngRoute" : "/grm/communitybase/js/angular/angular-route",
		"bootstrapUI" : "/grm/communitybase/js/angular/angularUI/ng-bootstrap/ui-bootstrap-tpls-0.7.0.min",
		"datetimepicker" : "/grm/communitybase/js/datetimepicker/js/bootstrap-datetimepicker.min",
		"datetimepickerCn" : "/grm/communitybase/js/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
		"jqueryUI" : "/grm/communitybase/js/jqueryui/jquery-ui-1.10.3.custom.min",
		"uislider" : "/grm/communitybase/js/uislider/slider",
		"moment" : "/grm/communitybase/js/moment/moment",
		"websocket" : "/grm/communitybase/js/websocket"
	},
	shim : {
		'angular' : {
			'deps' : ['jquery'],
			'exports' : 'angular'
		},
		'angularSanitize' : ['angular'],
		'ngRoute' : ['angular'],
		'bootstrapUI' : ['angular'],
		'datetimepicker': ['jquery'],
		'datetimepickerCn': ['datetimepicker'],
		'jqueryUI': ['jquery'],
		'uislider': ['angular', 'jqueryUI'],
		'moment': {'exports' : 'moment'},
		'websocket': {'exports' : 'YGWebSocket'}
	},
	priority: [
		"jquery",
		"angular"
	]
});