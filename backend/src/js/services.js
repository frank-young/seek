angular.module('serviceData', [])
    .factory('settingData', ['$q','$http',function($q,$http){
        return {
            getData: function () {
                var defer = $q.defer();
                $http({
                    url: '/setting',
                    method: 'get' 
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            getListData: function () {
                var defer = $q.defer();
                $http({
                    url: '/setting/list',
                    method: 'get' 
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
                    url: '/setting/detail/'+id,
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
                    url: '/setting/update',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        setting:value
                    }
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            updatecopyData: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: '/setting/updatecopy',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        setting:value
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
                    url: '/setting/add',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        setting:value
                    }
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
                    url: '/setting/delete?id='+value._id,
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
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
            },
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
            },
            updateData: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: '/dish/update',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        dish:value
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
                    url: '/dish/add',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        dish:value
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
                    url: '/dish/detail/'+id,
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
                    url: '/dish/delete?id='+value._id,
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
            },
            updateData: function (value) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: '/cate/update',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        cate:value
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
                    url: '/cate/add',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        cate:value
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
                    url: '/cate/detail/'+id,
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
                    url: '/cate/delete?id='+value._id,
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
            getMonthData: function () {
                var defer = $q.defer();
                $http({
                    url: '/order/month',
                    method: 'get' 
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            getDayData: function () {
                var defer = $q.defer();
                $http({
                    url: '/order/day',
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
            downloadData: function (value) {
                var defer = $q.defer();
                $http({
                    url: '/order/download?year='+value.year+'&month='+value.month,
                    method: 'get'
                })
                .success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (msg) {
                    defer.reject(msg);
                });
                return defer.promise;
            },
            downloadDayData: function (value) {
                var defer = $q.defer();
                $http({
                    url: '/order/downloadday?year='+value.year+'&month='+value.month+'&day='+value.day,
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
            getItemDayData: function () {
                var defer = $q.defer();
                $http({
                    url: '/item/itemday',
                    method: 'get' 
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
            },
            downloadItemDayData: function (value) {
                var defer = $q.defer();
                $http({
                    url: '/item/download/itemday?year='+value.year+'&month='+value.month+'&day='+value.day,
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
                    url: '/item/delete?id='+value._id,
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

















