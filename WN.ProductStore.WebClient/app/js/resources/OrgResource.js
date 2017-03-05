define(["app"], function (app, BaseService) {

    var deps = ["$http", "BaseService"];

    function orgResource($http, BaseService) {

        return initResource($http, BaseService.restfulUrl);
    }

    var postHeader = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };

    function initResource($http, baseUrl) {
        var orgUrl = baseUrl + "org/";
        var addressUrl = baseUrl + "address/";
        return {
            getOrgList: function () {
                return $http.get(orgUrl + "queryOrg");
            },
            saveOrg: function (org) {
                return $http.post(orgUrl + "saveOrg", angular.toJson(org));
            },
            delOrg: function (orgId) {
                return $http.get(orgUrl + "delOrg", {params: {orgId: orgId}}, {headers: postHeader});
            },
            editOrg: function (orgId, orgName) {
                return $http.get(orgUrl + "editOrg", {params: {orgId: orgId, orgName: orgName}}, {headers: postHeader});
            },
            getOrgUserList: function (orgType) {
                return $http.get(orgUrl + "queryOrgUsers", {
                    params: {
                        type: orgType
                    }
                });
            },
            getOrgListByType: function (orgType) {
                return $http.get(orgUrl + "queryOrgByType", {
                    params: {
                        orgType: orgType
                    }
                });
            },
            queryOrgPid: function (orgPid) {
                return $http.get(orgUrl + "queryOrgPid", {
                    params: {
                        orgPid: orgPid
                    }
                });
            },
            searchAdderss: function (keyWord) {
                return $http.get(addressUrl + "searchAdderss", {
                    params: {
                        keyWord: keyWord,
                        pageNo: 0,
                        pageSize: 0
                    }
                });
            },
            saveOrgOrder: function (orgOrderVos) {
                return $http.post(orgUrl + "saveOrgOrder", angular.toJson(orgOrderVos));
            },
            queryOrgsByName: function (orgName) {
                return $http.get(addressUrl + "queryOrgsByName", {
                    params: {
                        orgName: orgName,
                        pageNo: 0,
                        pageSize: 0
                    }
                });
            }
        }
    }

    orgResource.$inject = deps;
    app.lazy.factory("OrgResource", orgResource);
});
