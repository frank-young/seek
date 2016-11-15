/********************************************************************************************************************
 *                                                      品项报告详情页面
 ********************************************************************************************************************/

angular.module("itemDetailMoudle", []).controller('ItemDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','orderData','itemData',
    function($scope,$window, $http, $stateParams,$alert,orderData,itemData) {
	$window.document.title = "品项报告详情"

    itemData.getIdData($stateParams.id).then(function(data){
        $scope.items = data.items
        $scope.total_fee = 0
        $scope.items.forEach(function(value){
            $scope.total_fee += value.total
        })
    })
    
    $scope.nowtime = new Date().getTime()
    $scope.printOrder = function(){
        $scope.nowtime = new Date().getTime()
        console.log($scope.nowtime)
        printFunc('print-item')
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

}])