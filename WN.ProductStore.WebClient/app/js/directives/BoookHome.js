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
            templateUrl: 'views/doctorTopic/doctorTopicList.html',
            replace: true,
            scope: {

            },
            link: function($scope) {
                   $scope.topics = [];
                 var pageNo = 1;
                 var pageSize = 10;
                 var scrollFlag = true;

                 //contextType： 4：互助：求医问药；5、话题
                 //listType：0代表显示新发布的（非1和2）；1表示显示我发布的；2代表显示我回复
                 $scope.contextType = 4;
                 $scope.listType =1;
                 if ($scope.contextType) {
                     $cookieStore.put('doctorTopicListContextType', $scope.contextType);
                 } else {
                     $scope.contextType = $cookieStore.get('doctorTopicListContextType');
                 }
                 if ($scope.listType) {
                     $cookieStore.put('doctorTopicListListType', $scope.listType);
                 } else {
                     $scope.listType = $cookieStore.get('doctorTopicListListType');
                 }
                 $scope.contextType = parseInt($scope.contextType);
                 $scope.listType = parseInt($scope.listType);
                 if ($scope.listType == 0) {
                     if ($scope.$parent.setEssenceActive) {
                         $scope.$parent.setEssenceActive("contexttype" + $scope.contextType);
                     } else {
                         $("#contexttype4,#contexttype5,#contexttype6").removeClass("weui_bar_item_on");
                         $('#contexttype' + $scope.contextType).addClass("weui_bar_item_on");
                     }
                     $scope.$parent.contextType = $scope.contextType;
                     $('#contexttype' + $scope.contextType).trigger("click");
                 }

                 $scope.title = "";
                 if ($scope.listType > 0) {
                     if ($scope.listType == 1) {
                         $scope.title = "我发布的";
                     } else {
                         $scope.title = "我回复的";
                     }
                     if ($scope.contextType == 5) {
                         $scope.title = $scope.title + "话题";
                     } else {
                         $scope.title = $scope.title + "互助";
                     }
                 }

                 //转换数据
                 function toModels(response) {
                     if (response && response.length > 0) {
                         for (var i = 0; i < response.length; i++) {
                             response[i].userPicUrl = BaseService.restfulUrl + 'fileUploadController/showPic/' + response[i].createUserPicId;
                             //内容
                             if (response[i].topicContent) {
                                 //response[i].topicContent = response[i].topicContent.replace(/<img src="restful\//g, '<img src=\"' + BaseService.restfulUrl);
                                 response[i].topicContent = response[i].topicContent.replace(/<[^>]*>/g, '');
                             }
                             $scope.topics.push(response[i]);
                         }
                         pageNo++;
                     } else {
                         scrollFlag = false;
                     }
                 }

                 //取列表数据
                 function getTopicList() {
                     if (scrollFlag) {
                         if ($scope.contextType == 5) {
                             //获取话题列表
                             DoctorTopicResource.getDiscussionSubjectList($scope.listType, pageNo, pageSize).success(function (response) {
                                 toModels(response);
                             });
                         } else {
                             //获取求医问药列表
                             DoctorTopicResource.getDiscussionMutualList($scope.listType, pageNo, pageSize).success(function (response) {
                                 toModels(response);
                             });
                         }
                     }
                 }

                 //scroll
                 $scope.scrollHandler = getTopicList;

                 //取列表数据
                 getTopicList();

                 //获取我发布的、我回复的求助是否有回复未读
                 if ($scope.listType == 0) {
                     $("#newRelease,#newReply").hide();
                     DoctorTopicResource.getDiscussionMutualState($scope.contextType).success(function (response) {
                         $scope.releaseState = response.releaseState;
                         $scope.replyState = response.replyState;
                         if ($scope.releaseState) {
                             $("#newRelease").show();
                         }
                         if ($scope.replyState) {
                             $("#newReply").show();
                         }
                     });
                 }

                 //转到新发布，我发布的，我回复的
                 $scope.gotoTopic = function gotoTopic(type, topicId) {
                     if (type == 0) {
                         $state.go("home.newDoctorTopic", {
                             contextType: $scope.contextType
                         });
                     } else if (type == 1 || type == 2) {
                         $state.go("home.doctorTopicList", {
                             contextType: $scope.contextType,
                             listType: type
                         });
                     } else {
                         $state.go("home.doctorTopicDetail", {
                             topicId: topicId,
                             contextType: $scope.contextType,
                             detailType: $scope.listType
                         });
                     }
                 }

                 //转到新发布，我发布的，我回复的
                 $scope.addTopic = function addTopic(type) {
                     if (!$scope.contextType) {
                         $scope.contextType = $cookieStore.get('doctorTopicListContextType');
                     }
                     if (type == 0) {
                         $state.go("home.newDoctorTopic", {
                             contextType: $scope.contextType
                         });
                     } else if (type == 1 || type == 2) {
                         $state.go("home.doctorTopicList", {
                             contextType: $scope.contextType,
                             listType: type
                         });
                     }
                 }
            }
        };
    }


    directive.$inject = deps;
    return app.lazy.directive('fcBoookHome', directive);
});

