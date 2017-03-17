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
            $scope.pageSize = 2;
            $scope.queryString = "";
            /**分页信息 */
            $scope.pageList = [];


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
                ProductService.getProductList($scope.pageIndex, $scope.pageSize, $scope.queryString).success(function (data) {
                    $scope.productList = data.Products;

                    // $scope.pageCount = Math.ceil(response.TotalCount / 10);
                    // for (var i = 0; i < $scope.pageCount; i++) {
                    //     $scope.pageList.push(i + 1);
                    // }
                    $scope.totalpage = Math.ceil(data.TotalCount / $scope.pageSize);
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



            $scope.selectPage = function (page) {
                if (Number.isNaN(page) || page < 0) {
                    return;
                }
                //因为只显示5个页数，大于2页开始分页转换
                $scope.Stocks = [];
                StockService.GetProductStockList(page, $scope.queryString).success(function (response) {
                    $scope.Stocks = response.ProductStockList;
                });
            };

            //上一页
            $scope.Previous = function () {
                $scope.selectPage($scope.selPage - 1);
            }
            //下一页
            $scope.Next = function () {
                $scope.selectPage($scope.selPage + 1);
            };
        }
    ]);
});