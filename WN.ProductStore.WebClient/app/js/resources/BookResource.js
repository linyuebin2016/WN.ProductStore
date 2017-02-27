/**
 * Created by xiaojianyong on 2016/12/21.
 */
define(["app"],function(app) {

	var deps = [ "$http", "BaseService" ];

	function BookResource($http, BaseService) {

		return initResource($http, BaseService.restfulUrl + "discussionController/", BaseService.restfulUrl, BaseService.formHeader);
	}
	var requestHeader = {
		"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
	};
	var postHeader = {
		"Content-Type" : "application/json;charset=utf-8"
	};

	function initResource($http, baseUrl,restfulUrl, formHeader) {
		return {
            //根据Isbn查询图书信息
            getInfoByIsbn : function (isbn) {
                return $http.get(baseUrl + "getGoodBookInfoByIsbn" , {
                    params : {
                        isbnCode: isbn
                    }
                });
            },
			//查询好书推荐列表
			queryBookList: function (orders, asc, pageNo, pageSize) {
				return $http.get(baseUrl + "getDiscussionBookList", {
					params: {
						orders: orders,
						asc: asc,
						pageNo: pageNo,
						pageSize: pageSize
					}
				});
			},

            //查询十大好书
            queryGoodBookList: function () {
                return $http.get(baseUrl + "getTenGoodBookList");
            },

			//查询好书推荐详情
			queryBookDetail : function (bookId) {
				return $http.get(baseUrl + "getDiscussionBookDetailById" , {
					params : {
                        goodBookId: bookId
					}
				});
			},

			//点赞or取消点赞
			setBookPraise: function (bookId) {
				return $http.get(baseUrl + "setDiscussionBookPraise", {
					params: {
                        goodBookId: bookId
					}
				});
			},
            //发布好书
            addBook: function (book) {
                // return $http.get(baseUrl + "saveGoodBookDetail", {
                //     params: {
                //         detailVo: book
                //     }
                // });

                return $http.post(baseUrl + "saveGoodBookDetail", angular.toJson(book));
            }
		}
	}

	BookResource.$inject = deps;
	app.lazy.factory("BookResource", BookResource);
});