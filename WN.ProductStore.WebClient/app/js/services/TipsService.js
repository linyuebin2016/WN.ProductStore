define(["app"], function(app) {

	var deps = [];

	function tipsService() {
		return {
			show: function(msg, time) {
				$tip.children().html(msg);
				$tip.finish().slideDown(500).delay(time || 3000).fadeOut(1000);
			}
		};
	}

	function createTip() {
		var $tip = angular.element('<div class="tips"><div class="tips-body"></div></div>');
		$tip.appendTo(document.body);
		return $tip;
	}

	var $tip = createTip();

	tipsService.$inject = deps;
	app.lazy.service("TipsService", tipsService);
});
