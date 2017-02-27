/**
 * Created by zhuyunfeng on 2016/12/27.
 */
define(["app",
    "jquery",
    "resources/BookResource",
    "services/BaseService",
    "directives/CommentForWx",
    "directives/AReward",
    'directives/UserImageForWx'
], function(app) {

    "use strict";

    var deps = ["$scope","$cookieStore", "$stateParams","BookResource", "BaseService"];

    function controller($scope,$cookieStore,$stateParams, BookResource, BaseService) {
        var bookId = '';
        if($stateParams.bookId==undefined || $stateParams.bookId==null){
            bookId = $cookieStore.get("bookId");
        } else {
            bookId = $stateParams.bookId;
            $cookieStore.put("bookId", bookId);
        }
        $scope.baseUrl = BaseService.restfulUrl;
        $scope.Book = {};
        //初始化页面数据
        init();
        function  init(){
            //查询好书推荐列表
            BookResource.queryBookDetail(bookId).success(function(resp){
                var item = resp;
                item.recommendReason = item.recommendReason.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
                // <a>标签替换
                var urls = item.recommendReason.match(/<a.*?href=.*?>/g);
                if (urls) {
                    var replaceUrls = [];
                    for (var i = 0; i < urls.length; i++) {
                        var url = urls[i].match(/<a.*?href=".*?"/).replace(/<a.*?href="/, '').replace(/"/, '');
                        url = "<a href=" + "javascript:openWindow('" + url + "') class='hand'>";
                        replaceUrls.push(url);
                    }
                    for (var i = 0; i < urls.length; i++) {
                        item.recommendReason = item.recommendReason.replace(urls[i], replaceUrls[i]);
                    }
                }
                $scope.Book = item;
            });
        }

        //点赞好书
        $scope.likeBook=function(){
            BookResource.setBookPraise($scope.Book.goodBookId).success(function (data) {
                $scope.Book.userPraiseState=!$scope.Book.userPraiseState;
                if($scope.Book.userPraiseState) {
                    $scope.Book.praiseCount ++;
                }else {
                    $scope.Book.praiseCount --;
                }
            });
        }
    }

    controller.$inject = deps;
    app.lazy.controller("BookViewController", controller);
});

