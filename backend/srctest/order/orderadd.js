/********************************************************************************************************************
 *                                                      新建订单页面
 ********************************************************************************************************************/

angular.module("orderAddMoudle", []).controller('OrderAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
	$window.document.title = "添加订单"

    if(localStorage.order){
        $scope.order = JSON.parse(localStorage.order)
    }else{
        $scope.order ={   
            "isTop":false,
            "checked":false,
            "isChecked":false,
            "number":0,
            "name":"",
            "price":null,
            "search":"",
            "ishost":false,
            "other1":"", 
            "other2":"", 
            "description":"", 
            "history":'添加订单'
        }
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.order= JSON.stringify($scope.order);
    }, 6000);

    $scope.saveOrder = function(value){
        orderData.addData(value).then(function(data){
            if(data.status==1){
                $scope.changeAlert(data.msg)
                window.history.go(-1)
                localStorage.removeItem("order") 
                clearInterval(time)
            }else{
                $scope.changeAlert(data.msg)
            }
            
        })
    }

}])