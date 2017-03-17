/**
 * Created by linyuebin
 */
define([
    "app.config",
    'directives/InfiniteScroll'
], function (app) {

    app.controller('ProductListController', ['$scope', '$state', 'ProductService', 'baseImgServer',
        function ($scope, $state, ProductService, baseImgServer) {
            $scope.baseImgServer = baseImgServer;
            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.queryString = "";
            /**分页信息 */
            $scope.pageList = [];
            $scope.sort = "none";

            //修改商品
            $scope.modifyProduct = function (spid) {
                $state.go('productAM', {
                    spid: spid
                });
            };


            //商品Detail
            $scope.goDetail = function (spid) {
                $state.go('productDetail', {
                    spid: spid
                });
            };


            $scope.current_page = 1;

            $scope.getData = function () {
                ProductService.getProductList($scope.pageIndex, $scope.pageSize, $scope.queryString, $scope.sort).success(function (data) {

                    if ($scope.pageIndex == 1) {
                        $scope.productList = data.Products;
                    } else {
                        $scope.productList = $scope.productList.concat(data.Products);
                    }
                    $scope.pageIndex++;
                });
            }
            $scope.scrollHandler = getList;

            $scope.getData();

            function getList() {
                $scope.getData();
            }

            $scope.delete = function (id) {
                ProductService.delete(id).success(function (response) {
                    alert("删除成功！");
                    $scope.getData();
                });
            }

            // $scope.list = Paginator(getList2, $scope.pageSize);

            /**搜索 */
            $scope.seach = function () {
                $scope.pageList = [];
                $scope.getData();
            }

            $scope.sortList = function (value) {
                $scope.sort = value;
                $scope.pageIndex = 1;
                $scope.productList=[];
                $scope.getData();
            }

        }
    ]);
});