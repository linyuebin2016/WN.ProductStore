/**
 * Created by xiaojianyong on 2016/11/13.
 */
define(["app"],function(app) {

    var deps = [ "$http", "BaseService" ];

    function userSettingResource($http, BaseService) {

        return initResource($http, BaseService.restfulUrl);
    }
    var requestHeader = {
        "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
    };
    var postHeader = {
        "Content-Type" : "application/json;charset=utf-8"
    };

    function initResource($http, baseUrl) {
        var userUrl = baseUrl +"user/";
        var userOtherInfoUrl = baseUrl +"userOtherInfo/";
        return {
            getUserByUserId : function(userId){
                return $http.post(userUrl + "getUserByUserId" , {
                    userId : userId
                },{
                    headers: requestHeader
                })
            },
            updateUserInfo : function(userVo) {
                return $http.post(userUrl + "updateUserInfo" ,angular.toJson(userVo));
            },

            queryUserCard : function(userId) {
                return $http.get(userUrl + "queryUserCard", {
                    params : {
                        userId: userId
                    }
                });
            },

            //社内职务
            getUserPartDutyList : function(){
                return $http.get(userOtherInfoUrl + "queryUserPartyPosts" )
            },
            //社内职务save
            saveUserPartyPost: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserPartyPost", angular.toJson(modal),
                    {
                        headers: postHeader
                    });
            },
            //社内职务delete
            removeUserPartyPost: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserPartyPost", {
                    params : {
                    id: id
                }
                });
            },
            //业务专长
            queryUserSpecialtys : function(){
                return $http.get(userOtherInfoUrl + "queryUserSpecialtys" )
            },
            saveUserSpecialty: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserSpecialty", angular.toJson(modal));
            },
            removeUserSpecialty: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserSpecialty", {
                    params : {
                        id: id
                    }
                });
            },

            //社会职务
            queryUserSocietyPosts : function(){
                return $http.get(userOtherInfoUrl + "queryUserSocietyPosts" )
            },
            saveUserSocietyPost: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserSocietyPost", angular.toJson(modal));
            },
            removeUserSocietyPost: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserSocietyPost", {
                    params : {
                        id: id
                    }
                });
            },

            //学历信息
            queryUserEducations : function(){
                return $http.get(userOtherInfoUrl + "queryUserEducations" )
            },
            saveUserEducation: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserEducation", angular.toJson(modal));
            },
            removeUserEducation: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserEducation", {
                    params : {
                        id: id
                    }
                });
            },

            //工作履历
            queryUserWorkExperiences : function(){
                return $http.get(userOtherInfoUrl + "queryUserWorkExperiences" )
            },
            saveUserWorkExperience: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserWorkExperience", angular.toJson(modal));
            },
            removeUserWorkExperience: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserWorkExperience", {
                    params : {
                        id: id
                    }
                });
            },

            //培训情况
            queryUserTrainingExperiences : function(){
                return $http.get(userOtherInfoUrl + "queryUserTrainingExperiences" )
            },
            saveUserTrainingExperience: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserTrainingExperience", angular.toJson(modal));
            },
            removeUserTrainingExperience: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserTrainingExperience", {
                    params : {
                        id: id
                    }
                });
            },

            //论文著作
            queryUserLiteratures : function(){
                return $http.get(userOtherInfoUrl + "queryUserLiteratures" )
            },
            saveUserLiterature: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserLiterature", angular.toJson(modal));
            },
            removeUserLiterature: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserLiterature", {
                    params : {
                        id: id
                    }
                });
            },

            //专业技术工作
            queryUserProfessionProjects : function(){
                return $http.get(userOtherInfoUrl + "queryUserProfessionProjects" )
            },
            saveUserProfessionProject: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserProfessionProject", angular.toJson(modal));
            },
            removeUserProfessionProject: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserProfessionProject", {
                    params : {
                        id: id
                    }
                });
            },

            //专业技术成果
            queryUserProfessionResultses : function(){
                return $http.get(userOtherInfoUrl + "queryUserProfessionResultses" )
            },
            saveUserProfessionResults: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserProfessionResults", angular.toJson(modal));
            },
            removeUserProfessionResults: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserProfessionResults", {
                    params : {
                        id: id
                    }
                });
            },

            //获奖情况
            queryUserAchieves : function(){
                return $http.get(userOtherInfoUrl + "queryUserAchieves" )
            },
            saveUserAchieve: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserAchieve", angular.toJson(modal));
            },
            removeUserAchieve: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserAchieve", {
                    params : {
                        id: id
                    }
                });
            },

            //专利情况
            queryUserPatents : function(){
                return $http.get(userOtherInfoUrl + "queryUserPatents" )
            },
            saveUserPatent: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserPatent", angular.toJson(modal));
            },
            removeUserPatent: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserPatent", {
                    params : {
                        id: id
                    }
                });
            },

            //媒体报道
            queryUserMediaReports : function(){
                return $http.get(userOtherInfoUrl + "queryUserMediaReports" )
            },
            saveUserMediaReport: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserMediaReport", angular.toJson(modal));
            },
            removeUserMediaReport: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserMediaReport", {
                    params : {
                        id: id
                    }
                });
            },
            //可提供资源
            queryUserResources : function(){
                return $http.get(userOtherInfoUrl + "queryUserResources" )
            },
            saveUserResource: function (modal) {
                return $http.post(userOtherInfoUrl + "saveUserResource", angular.toJson(modal));
            },
            removeUserResource: function (id) {
                return $http.get(userOtherInfoUrl + "removeUserResource", {
                    params : {
                        id: id
                    }
                });
            },

            /**
             * 获取用户其他信息汇总（移动端使用）
             */
            queryUserInfoSummary: function(){
                return $http.get(userOtherInfoUrl + "queryUserInfoSummary")
            },
        }
    }

    userSettingResource.$inject = deps;
    app.lazy.factory("UserSettingResource", userSettingResource);
});