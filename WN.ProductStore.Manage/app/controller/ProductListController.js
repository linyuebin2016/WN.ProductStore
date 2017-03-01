/**
 * Created by shengxiangyang on 2017-02-09.
 */
define(function (require) {
    var app = require('../app.config');

    app.controller('ProductListController', ['$scope', '$state', 'ProductService', 'baseImgServer',
        function ($scope, $state, ProductService, baseImgServer) {
            $scope.baseImgServer = baseImgServer;
            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.queryString = "";
            getList();

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


            $scope.delete = function (id) {
                ProductService.delete(id).success(function (response) {
                    alert("删除成功！");
                    getList();
                });
            }

            function getList() {
                ProductService.getProductList($scope.pageIndex, $scope.pageSize, $scope.queryString).success(function (response) {
                    $scope.productList = response.Products;

                    $scope.pageCount = Math.ceil(response.TotalCount / 10);
                    for (var i = 0; i < $scope.pageCount; i++) {
                        $scope.pageList.push(i + 1);
                    }
                });
            }

            /**搜索 */
            $scope.seach = function () {
                getList();
            }

            /**分页信息 */
            $scope.pageList = [];

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