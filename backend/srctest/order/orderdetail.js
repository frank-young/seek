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
    //获取支付方式
    paytypeData.getData().then(function(data){
        $scope.payTypeArr = data.paytypes.map(function(value){
            return value.label
        })
    })
    
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

    $scope.printOrder = function(){
        $scope.nowtime = new Date().getTime()
        console.log($scope.nowtime)
        printFunc('print')
    }

        function printFunc(id){
            var ele = document.getElementById(id)
            var content = document.getElementById('print-content')
            
            var newObj=ele.cloneNode(true)
            content.innerHTML = ""
            content.appendChild(newObj)
            window.print()
            content.innerHTML = ""

        } 

}]);