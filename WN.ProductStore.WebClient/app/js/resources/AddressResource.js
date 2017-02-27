/**
 * Created by gru on 15-1-22.
 */
define(["app", "services/BaseService"], function (app) {

    var deps = ["$http", "BaseService"];

    function userExResource($http, BaseService) {
        return initResource($http, BaseService.restfulUrl + "address/");
    }

    var reqHeader = {
        "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, preUrl) {
        return {
            //找人列表
            queryOrg: function() {
                return $http.get(preUrl + "queryOrg");
            },

            //列表关联人员
            queryOrgUsersByName: function(orgId, pageNo, pageSize,userName) {
                return $http.get(preUrl + "queryOrgUsersByName", {
                    params: {
                        orgId: orgId,
                        pageNo: pageNo,
                        pageSize: pageSize,
                        userName: userName
                    }
                });
            },
            //专家名录列表
            queryProficientCategory : function() {
                return $http.get(preUrl + "queryProficientCategory");
            },

            /**
             * 查询某个分类的人员
             * @param cateId
             * @param pageNo
             * @param pageSize
             * @param req
             * @return
             */
            queryProficientUsers: function(cateId, keyWord,pageNo, pageSize) {
                return $http.get(preUrl + "queryProficientUsers", {
                    params: {
                        cateId: cateId,
                        keyWord: keyWord,
                        pageNo: pageNo,
                        pageSize: pageSize

                    }
                });
            },

            queryOrgWx : function () {
                return $http.get(preUrl + "m/queryOrg");
            },

            queryOrgPid: function(orgPid) {
                return $http.get(preUrl +"m/queryOrgPid",{
                    params: {
                        orgPid : orgPid
                    }
                });
            },
            queryAllParentOrgs : function(orgId){
                return $http.get(preUrl +"m/queryAllParentOrgs",{
                    params: {
                        orgId : orgId
                    }
                });
            },
            queryOrgInfo : function(orgId){
                console.log("queryOrgInfo");
                return $http.get(preUrl +"m/queryOrgInfo",{
                    params: {
                        orgId : orgId
                    }
                });
            }

        } ;
    }


    userExResource.$inject = deps;
    return app.lazy.service("AddressResource", userExResource);
});
