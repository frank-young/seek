angular.module('serviceData', [])
    .factory('orderData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/order',
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
                    url: '/order/update',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        order:value
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
                    url: '/order/add',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        order:value
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
                    url: '/order/detail/'+id,
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
                    url: '/order/delete?id='+value._id,
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
    .factory('domainData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/domain/detail',
                    method: 'get'
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
    .factory('dishData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/dish',
                    method: 'get' 
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
    .factory('cateData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/cate',
                    method: 'get' 
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