define(function (require) {
    var angular = require('angular'); var app = require('../app.config');
    app.service('CustomerService', ['$http', function ($http) {
        var requestUrl = "http://192.168.1.111/ProductStore/api";
        var pageSize = 10;
        return {
            GetCustomerList: function (pageIndex, pageSize, queryString) {
                return $http.get(requestUrl + "/customer/GetCustomerList", {
                    params: {
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        queryString: queryString
                    }
                })
            },


            //保存客户
            SaveCustomer: function (customer) {
                var transFn = function (customer) {
                    return $.param(customer);
                };
                var postCfg = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    transformRequest: transFn
                };
                return $http.post(requestUrl + "/customer/AddCustomer", customer, postCfg);
            },

            //删除客户
            DeleteCustomer: function (id) {
                return $http.get(requestUrl + "/customer/DeleteCustomer", {
                    params: {
                        id: id
                    }
                })

            },
            //获取客户
            GetDetail: function (id) {
                return $http.get(requestUrl + "/customer/GetCustomer", {
                    params: {
                        id: id
                    }
                })

            },
            //更新客户
            
            UpdateCustomer: function (customer) {
                var transFn = function (customer) {
                    return $.param(customer);
                };
                var postCfg = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    transformRequest: transFn
                };
                return $http.post(requestUrl + "/customer/Update", customer, postCfg);
            },


        };
    }]);
});