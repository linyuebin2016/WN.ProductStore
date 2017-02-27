/**
 * Created by zhuyunfeng on 2017/1/11.
 */
define([
    'app',
    "jquery",
    'lodash',
    'resources/DrawResource',
    "services/BaseService",
    "directives/CommentForWx",
    'services/DownloadFileService',
    'services/UserService'
], function (app, $, _) {

    var deps = ['$scope', '$state', '$stateParams','DrawResource', 'UserService', "BaseService"];

    function controller($scope, $state, $stateParams,DrawResource, UserService,BaseService) {
        /**返回 */
        $scope.goBack = function goBack() {
            window.history.back();
        }

        var drawId=$stateParams.drawId;
        $scope.baseUrl = BaseService.restfulUrl;

        var currentUser = UserService.getCurrentUser();
        $scope.draw={};
        $scope.clockName="开始打卡";

        //获取抽奖信息
        function getDraw() {
            // return DrawResource.queryDraw(drawId,1).success(function loaded(data) {
            //     var item = data;
            //     //任务内容
            //     item.info = item.info.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
            //     // <a>标签替换
            //     var urls = item.info.match(/<a.*?href=.*?>/g);
            //     if (urls) {
            //         var replaceUrls = [];
            //         for (var i = 0; i < urls.length; i++) {
            //             var url = urls[i].match(/<a.*?href=".*?"/).replace(/<a.*?href="/, '').replace(/"/, '');
            //             url = "<a href=" + "javascript:openWindow('" + url + "') class='hand'>";
            //             replaceUrls.push(url);
            //         }
            //         for (var i = 0; i < urls.length; i++) {
            //             item.info = item.info.replace(urls[i], replaceUrls[i]);
            //         }
            //     }
            //     $scope.draw=item;
            // });
            $scope.draw={};

        }
        getDraw();

        /**点赞 */
        $scope.drawPraise = function drawPraise() {
            DrawResource.setDrawPraise(drawId).success(function (response) {
                $scope.draw.praiseCount = response;
                $scope.draw.praiseState = !$scope.draw.praiseState;
            });
        }
        /**关注 */
        $scope.drawAttention = function drawAttention() {
            DrawResource.setDrawAttention(drawId).success(function (response) {
                $scope.draw.attentionCount = response;
                $scope.draw.attentionState = !$scope.task.attentionState;
            });
        }

        //打卡按钮
        $scope.clock=function () {
            $state.go("home.drawClock",{drawId:drawId});
        }
        //抽奖按钮
        $scope.doDraw=function () {
            $state.go("home.drawClock",{drawId:drawId});
        }
        //抽奖人员列表
        $scope.toDrawPresonList=function () {
            $state.go("home.drawPersonList",{drawId:drawId});
        }
    }

    controller.$inject = deps;
    return app.lazy.controller('DrawDetailController', controller);
});
