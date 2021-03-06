/********************************************************************************************************************
 *                                                      月报表页面
 ********************************************************************************************************************/

angular.module("orderMonthMoudle", []).controller('OrderMonthCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
    	$window.document.title = "月报表"
        /*分页*/
        $scope.itemsPerPage = 5;
        $scope.currentPage = 1;
        /*生成所有报表，并且返回链接*/
        orderData.getMonthData().then(function(data){
            $scope.order=data.orders;
            $scope.order.forEach(function(value,index){
                
                orderData.downloadData(value).then(function(data){
                    value.link = data.link
                    value.file = data.file
                })
            })

        })


    }
])