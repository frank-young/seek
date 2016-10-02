angular.module('serviceData', [])
    .factory('customerData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/customer',
                    method: 'get' 
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            updateData: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: '/customer/update',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        customer:value
                    }
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            addData: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: '/customer/add',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        customer:value
                    }
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            getIdData: function (id) {
                var defer = $q.defer();
                $http({
                    url: '/customer/detail/'+id,
                    method: 'get'
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            deleteData: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'DELETE',
                    url: '/customer/delete?id='+value._id,
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            }
        }
    }])