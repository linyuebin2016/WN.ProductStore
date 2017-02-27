/**
 * Created by zhuyunfeng on 2017/1/5.
 */
define(['app',
    "directives/UserPanel"
], function(app, _ ) {

    var deps = ["BaseService"];

    function directive( BaseService) {
        return {
            restrict: 'EA',
            templateUrl: 'views/user/UserImage.html',
            replace: true,
            scope: {
                userId: '=userId',
                userImage:'=?',
                userName:'=?',
                userPanel:'=',
                imageType:'=?',//0:显示头像 1：显示名字
                imageSize:'=?'//0:40*40 1:30*30
            },
            link: function($scope) {
                if($scope.imageType==undefined || $scope.imageType==null)
                {
                    $scope.imageType=0;
                }
                if($scope.imageSize==undefined || $scope.imageSize==null || $scope.imageSize==0){
                    $scope.sizeStyle={width: 40, height: 40}
                }else {
                    $scope.sizeStyle={width: 30, height: 30}
                }
                $scope.baseUrl = BaseService.restfulUrl;
                //$scope.UserPanel={visible:false,chat:null};
                $scope.showMessages =function(event){
                    if ($scope.userPanel.visible === true){
                        $scope.userPanel.visible = false;
                        $scope.userPanel.chat = null;
                    } else {
                        var user={userId:$scope.userId};
                        $scope.userPanel.visible = true;
                        $scope.userPanel.chat = user;
                    }
                    event.stopPropagation();
                }
            }
        };
    }


    directive.$inject = deps;
    return app.lazy.directive('fcUserImage', directive);
});