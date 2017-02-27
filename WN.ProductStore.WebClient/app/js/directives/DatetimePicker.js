define(["app", "datepickerCn"], function(app) {

	// 日期时间选择器打开之后首先显示的视图。 可接受的值：
	//
	// 0 or 'hour' for the hour view
	// 1 or 'day' for the day view
	// 2 or 'month' for month view (the default)
	// 3 or 'year' for the 12-month overview
	// 4 or 'decade' for the 10-year overview. Useful for date-of-birth
	// datetimepickers.
	function getSuitableView(dateFormat) {
		if (dateFormat == null || dateFormat.length == 0
				|| dateFormat == "yyyy-mm-dd") {
			return {
				minView : 2
			};
		} else if (dateFormat == "yyyy-mm") {
			return {
				startView : 3,
				minView : 3
			};
		} else if (dateFormat == "yyyy-mm-dd hh") {
			return {
				minView : 1
			};
		} else if (dateFormat == "yyyy-mm-dd hh:ii") {
			return {
				minView : 0
			};
		}
		return {};
	}

	app.lazy.directive("fcDatetimepicker", function() {
		return {
			restrict : "A",
			require: "?ngModel",
			// added by xuyunzhou, callback while pick a date
			scope : {
				onSelect : "&onSelect",
				date : "=ngModel"
			},
			link : function(scope, elem, attrs, ngModel) {
				if(!ngModel) {
					return;
				}

				var dateFormat = attrs["fcDatetimepicker"] || attrs["dateFormat"];
				var pickerPosition = attrs["pickerPosition"] || "bottom-right";
				var view = getSuitableView(dateFormat);

				var dpglobal = $.fn.datetimepicker.DPGlobal;
				var format = dpglobal.parseFormat(dateFormat || "yyyy-mm-dd", "standard");

				$(elem).datetimepicker($.extend({
					format : dateFormat || "yyyy-mm-dd",
					language : 'zh-CN',
					todayBtn : true,
					autoclose : true,
					forceParse : 0,
					pickerPosition: pickerPosition
				}, view))
				.on('changeDate', function(ev){
					var date = dpglobal.formatDate(ev.date, format, "zh-CN", "standard");
				    // scope.$eval(attrs["ngModel"] + "='" + date+"'");
					// can use this directly.
//				    ngModel.$setViewValue(date);
					scope.date = date;
				    if(scope.onSelect) {
				    	scope.onSelect({$date:date});
				    }
				    scope.$apply();
				});
			}
		};
	});

});
