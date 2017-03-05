/**
 * Created by zhuyunfeng on 2017/2/16.
 */


define(['app',
    "resources/BookResource"
], function(app, _ ) {

    var deps = ['$state',"BaseService", "BookResource"];

    function directive( $state,BaseService, BookResource) {
        return {
            restrict: 'EA',
            templateUrl: 'views/book/bookHome.html',
            replace: true,
            scope: {

            },
            link: function($scope) {
                var pageNo = 1;
                var pageSize = 10;
                $scope.baseUrl = BaseService.restfulUrl;
                $scope.BookList = [];
                $scope.GoodBookList = [];

                init();
                function init() {
                    getBookList();
                    getGoodBookList();
                }
                //好书推荐列表查询
                function getBookList() {
                        BookResource.queryBookList(0, 0, pageNo, pageSize).success(function(resp) {
                            if (resp.length && resp.length > 0) {
                                $scope.BookList = $scope.BookList.concat(resp);
                            }
                        });

                }
                //获得十大好书
                function getGoodBookList(){
                    BookResource.queryBookList(1, 0, 1, 10).success(function (resp) {
                        if (resp.length && resp.length > 0) {
                            $scope.GoodBookList = resp;
                        }
                    });
                }

                //查看明细
                $scope.queryItemById = function(book) {
                    //跳转到明细页面
                    $state.go("home.bookView", {
                        bookId: book.goodBookId
                    });

                }

                //跳转到更多
                $scope.queryMore = function() {
                    //跳转到明细页面
                    $state.go("home.book");

                }

                //点赞好书
                $scope.likesBook = function(book) {
                    BookResource.setBookPraise(book.goodBookId).success(function() {

                    });
                }
            }
        };
    }


    directive.$inject = deps;
    return app.lazy.directive('fcBookHome', directive);
});

