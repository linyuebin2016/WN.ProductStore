define(["app",
    "services/LocalStorageService",
    "resources/ChannelRecommendResource"
], function (app) {

    var deps = ["$scope", "$state", "BaseService",  'ChannelRecommendResource'];

    function controller($scope, $state, BaseService,  ChannelRecommendResource) {

        $scope.baseUrl = BaseService.restfulUrl;
        $scope.sortParam = 0;
        $scope.models = {};
        /**参数 */
        $scope.param = {
            pageNo: 1,
            pageSize: 10,
            keyword: undefined,
            orderProp: undefined, //排序字段
            orderType: 0 //排序  （0降 1升）
        };

        $scope.sort = {
            articleCount: 0,
            readCount: 0,
            attentionCount: 0,
            praiseCount: 0
        }
        $scope.scrollHandler = _scrollHandler;

        function _scrollHandler() {
            $scope.param.pageNo++;
            queryRecommendChannels();
        }

        queryRecommendChannels();

        /**列表 */
        function queryRecommendChannels() {
            ChannelRecommendResource.queryRecommendChannels($scope.param).success(function (response) {
                $scope.models = response;
            });
        }

        /**搜索 */
        $scope.query = function query() {
            $scope.param.orderProp = undefined;
            queryRecommendChannels();
        }

        //时间排序
        $scope.sortByDate = function () {
            $scope.sortParam = 0;
            $scope.param.orderProp = "itemTotal";
            $scope.sort.articleCount = getOrderType($scope.sort.articleCount);
            $scope.param.orderType = $scope.sort.articleCount;
            queryRecommendChannels();
        }

        //关注用户排序
        $scope.sortByAttentionCount = function sortByAttentionCount() {
            $scope.sortParam = 1;
            $scope.param.orderProp = "contractUserTotal";
            $scope.sort.attentionCount = getOrderType($scope.sort.attentionCount);
            $scope.param.orderType = $scope.sort.attentionCount;
            queryRecommendChannels();
        }

        //文章排序
        $scope.sortByArticleCount = function sortByArticleCount() {
            $scope.param.orderProp = "itemTotal";
            $scope.sort.articleCount = getOrderType($scope.sort.articleCount);
            $scope.param.orderType = $scope.sort.articleCount;
            queryRecommendChannels();
        }

        //阅读排序
        $scope.sortByReadCount = function sortByReadCount() {
            $scope.param.orderProp = "readTotal";
            $scope.sort.readCount = getOrderType($scope.sort.readCount);
            $scope.param.orderType = $scope.sort.readCount;
            queryRecommendChannels();
        }

        //点赞排序
        $scope.sortByPraiseCount = function sortByPraiseCount() {
            $scope.param.orderProp = "praiseTotal";
            $scope.sort.praiseCount = getOrderType($scope.sort.praiseCount);
            $scope.param.orderType = $scope.sort.praiseCount;
            queryRecommendChannels();
        }

        // /**关注 */
        // $scope.subscribeChannel = function subscribeChannel(groupId) {
        //     var d = MessageBox.confirmResult("确定关注？");
        //     d.result.then(function (result) {
        //         if (result === "yes") {
        //             ChannelRecommendResource.subscribeChannel(groupId).success(function (response) {
        //                 queryRecommendChannels();
        //             });
        //         }
        //     });
        // }

        /**清空搜索条件 */
        $scope.clearQueryText = function clearQueryText() {
            $scope.param.keyword = undefined;
            queryRecommendChannels();
        }

        function getOrderType(type) {
            var value;
            if (type == 0) {
                value = 1;
            } else {
                value = 0;
            }
            return value;
        }

        //跳转到资讯号发布的信息列表
        $scope.goGroupItemList = function (group) {
            $state.go('home.channelItemList', {
                groupId: group.groupId
            });
        }
    }

    controller.$inject = deps;
    app.lazy.controller("ChannelRecommendController", controller);
});