/********************************************************************************************************************
 *                                                      日报表页面
 ********************************************************************************************************************/

angular.module("orderDayMoudle", []).controller('OrderDayCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
    	$window.document.title = "订单列表"
        /*分页*/
        $scope.itemsPerPage = 8
        $scope.currentPage = 1
        /*生成所有报表，并且返回链接*/
        orderData.getDayData().then(function(data){
            $scope.order=data.orders
            $scope.order.forEach(function(value,index){
                
                orderData.downloadDayData(value).then(function(data){
                    value.link = data.link
                    value.file = data.file
                })
            })

        })

    }
])