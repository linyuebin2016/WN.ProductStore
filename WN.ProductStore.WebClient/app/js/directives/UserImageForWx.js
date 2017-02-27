
/**
 * Created by zhuyunfeng on 2017/1/5.
 */
define(['app'
], function(app, _ ) {

    var deps = ['$state',"BaseService"];

    function directive( $state,BaseService) {
        return {
            restrict: 'EA',
            templateUrl: 'views/common/UserImage.html',
            replace: true,
            scope: {
                userId: '=userId',
                userImage:'=?',
                userName:'=?',
                imageType:'=?'
            },
            link: function($scope) {
                $scope.baseUrl = BaseService.restfulUrl;
                if($scope.imageType==undefined || $scope.imageType==null)
                {
                    $scope.imageType=0;
                }
                // $scope.UserPanel={visible:false,chat:null};
                // $scope.showMessages =function(event){
                //     if ($scope.UserPanel.visible === true){
                //         $scope.UserPanel.visible = false;
                //         $scope.UserPanel.chat = null;
                //     } else {
                //         var user={userId:$scope.userId};
                //         $scope.UserPanel.visible = true;
                //         $scope.UserPanel.chat = user;
                //     }
                //     event.stopPropagation();
                // }

                $scope.gotoUserCard = function(){
                    $state.go("home.userCard",{userId : $scope.userId});
                }

            }
        };
    }


    directive.$inject = deps;
    return app.lazy.directive('fcUserImageForWx', directive);
});