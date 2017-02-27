define(["app",
    "jquery",
    "jqueryWeUI",
    "resources/BookResource"
], function(app,$) {

    "use strict";

    var deps = ["$scope",'UserService',"BookResource"];

    function controller($scope, UserService, BookResource) {

        var currentUser = UserService.getCurrentUser();
        $scope.ISBN="";
        $scope.Book = null;

        //根据图书ISBN号码得到图书信息
        $scope.getBookInfoByIsbn=function () {
            if($scope.ISBN.length==13){
                BookResource.getInfoByIsbn($scope.ISBN).success(function (resp) {
                    if(resp.isbnCode=="0"){
                        $scope.Book=null;
                        $.toast("该图书已经推荐!", "text");
                    }else {
                        if (resp == null ||resp.goodBookName==undefined || resp.goodBookName==null) {
                            $.toast("没有该图书的信息!", "text");
                            $scope.Book=null;
                        }else {
                            if(resp.goodBookSmallPicId==undefined || resp.goodBookSmallPicId==null) {
                                $.toast("请获取该图书的正确信息!");
                                $scope.Book=null;
                            }
                            else {
                                $scope.Book = resp;
                                $scope.Book.isbnCode = $scope.ISBN;
                            }
                        }
                    }
                });
            }else {
                $.toast("ISBN码长度为13位!", "text");
            }
        }
        $scope.clearNan=function(){
            $scope.ISBN=$scope.ISBN.replace(/\D/g,'');
        }

        //保存推荐信息
        $scope.saveGoodBook=function () {
            if($scope.Book!=null){
                if($scope.Book.recommendReason==undefined || $scope.Book.recommendReason==null ||$scope.Book.recommendReason.length<=0){
                    $.toast("请输入推荐理由!", "text");
                }else {
                    $.confirm("", "发布后不能修改，确认发布？", function() {
                        BookResource.addBook($scope.Book).success(function (resp) {
                            $.toast("发布成功!");
                            $scope.Book = resp;
                            window.history.go(-1);
                        });
                    });
                }
            }else {
                $.toast("没有该图书的信息!", "text");
            }
        }
    }

    controller.$inject = deps;
    app.lazy.controller("BookEditController", controller);
});
