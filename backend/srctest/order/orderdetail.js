/********************************************************************************************************************
 *                                                      订单详情页面
 ********************************************************************************************************************/

angular.module("orderDetailMoudle", []).controller('OrderDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','orderData',
    function($scope,$window, $http, $stateParams,$alert,orderData) {
	$window.document.title = "订单详情";
    /* 是否可编辑 */
	$scope.isEdit = true;

    var date = new Date();
    $scope.payTypeArr = ['现金支付','微信支付','支付宝支付','会员卡支付']
    
    /* 订单详情请求 */
    orderData.getIdData($stateParams.id).then(function (data) {
       $scope.order=data.order; 

    })

    $scope.saveOrder = function(value){
        orderData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }
   
    $scope.clone = function(){
        localStorage.order= JSON.stringify($scope.order);
        localStorage.showImages= JSON.stringify($scope.order.path);
    }

}]);