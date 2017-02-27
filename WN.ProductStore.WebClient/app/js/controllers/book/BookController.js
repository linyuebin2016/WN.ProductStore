define(["app",
    "services/BaseService",
    "resources/BookResource",
    'directives/InfiniteScroll'
], function(app) {

    "use strict";

    var deps = ["$scope", "$state", "BookResource", "BaseService"];

    function controller($scope, $state, BookResource, BaseService) {

        var pageNo = 1;
        var pageSize = 10;
        var scrollFlag = true;
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.BookList = [];
        $scope.GoodBookList = [];

        $scope.sort = {
            orders: 1,
            asc: 0
        };
        $scope.sorts = [{
                orders: 0,
                asc: 0
            }, //发布时间
            {
                orders: 1,
                asc: 0
            }, //点赞数
            {
                orders: 2,
                asc: 0
            } //评论数
        ];

        $scope.sortBy = function(sortitem) {
            $scope.sort = sortitem;
            if (clearDate()) {
                getBookList();
            }
        }

        function clearDate() {
            scrollFlag = true;
            $scope.BookList = [];
            pageNo = 1;
            return true;
        }

        $scope.scrollHandler = getBookList;
        init();

        function init() {
            getBookList();
        }
        //好书推荐列表查询
        function getBookList() {
            if (scrollFlag) {
                BookResource.queryBookList($scope.sort.orders, $scope.sort.asc, pageNo, pageSize).success(function(resp) {
                    if (resp.length && resp.length > 0) {
                        $scope.BookList = $scope.BookList.concat(resp);
                        if (resp.length < $scope.pageSize) {
                            scrollFlag = false;
                        }
                        pageNo++;
                    } else {
                        scrollFlag = false;
                    }
                });
            }
        }

        //查看明细
        $scope.queryItemById = function(book) {
            //跳转到明细页面
            $state.go("home.bookView", {
                bookId: book.goodBookId
            });

        }

        //发布好书
        $scope.newBook = function() {
            //跳转到明细页面
            $state.go("home.bookAdd");
        }

        //点赞好书
        $scope.likesBook = function(book) {
            BookResource.setBookPraise(book.goodBookId).success(function() {

            });
        }
    }

    controller.$inject = deps;
    app.lazy.controller("BookController", controller);
});
