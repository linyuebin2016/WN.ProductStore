/**
 * 多选组织树展示指令
 * Created by xiaojianyong on 2016/11/17.
 */
define(["app"], function(app) {
	
	var deps = ["$compile"];
	
	function directive($compile) {
		
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				scope.$watch(function () {return scope.$eval(attrs.ngBindHtml);},
					function(html) {
						ele.html(html);
						$compile(ele.contents())(scope);
					});
			}
		};
	}

	directive.$inject = deps;
	app.lazy.directive("compileHtml", directive);
});