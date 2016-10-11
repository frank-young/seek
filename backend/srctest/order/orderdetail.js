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
    /* 订单详情请求 */
    orderData.getIdData($stateParams.id).then(function (data) {
       $scope.order=data.order; 

    })

    $scope.saveOrder = function(value){
        orderData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }
   
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }

    $scope.clone = function(){
        localStorage.order= JSON.stringify($scope.order);
        localStorage.showImages= JSON.stringify($scope.order.path);
    }

}]);