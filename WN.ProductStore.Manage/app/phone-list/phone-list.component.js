'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('phoneList').
  component('phoneList', {
    templateUrl: 'product/phone-list.template.html',
    controller: ['Phone',
      function PhoneListController($http) {
        //this.phones = Phone.query();
        //this.orderProp = 'age';
        $http.get("http://10.52.0.87/ProductStroe/api/Product?pageIndex=0&pageSize=10&name=")
            .success(function (response) {
              $scope.names = response;});
      }


    ]
  });
