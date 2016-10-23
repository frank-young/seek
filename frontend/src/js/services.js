angular.module('serviceData', [])
    .factory('orderData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/ordertoday',
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
            },
             getGradeData: function () {
                var defer = $q.defer();
                $http({
                    url: '/order/grade',
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
            },
            getShopidData: function () {
                var defer = $q.defer();
                $http({
                    url: '/domain/shopid',
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
    .factory('dayData', ['$q','$http',function($q,$http){
        return {
            updateData: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: '/day/update',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        day:value
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
                    url: '/day/add',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        day:value
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
                    url: '/day/detail/'+id,
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
    .factory('itemData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/item',
                    method: 'get' 
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
                    url: '/item/add',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        item:value
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
                    url: '/item/detail/'+id,
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
    .factory('creditData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/credit',
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
    .factory('paytypeData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/paytype',
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
    .factory('settingData', ['$q','$http',function($q,$http){
        return {
            getRbac: function () {
                var defer = $q.defer();
                $http({
                    url: '/setting/rbac',
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
    .factory('memberorderData', ['$q','$http',function($q,$http){
        return {
            getInfo: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: '/memberorder',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        shopid:value
                    }
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },

        }
    }])
    .factory('memberData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/member',
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















