/********************************************************************************************************************
 *                                                      品项报告详情页面
 ********************************************************************************************************************/

angular.module("overDetailMoudle", []).controller('OverDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','orderData','itemData','overData','domainData','payorderData',
    function($scope,$window, $http, $stateParams,$alert,orderData,itemData,overData,domainData,payorderData) {
	$window.document.title = "结班报告详情"

    orderData.getGradeAllData($stateParams.id).then(function(data){
        $scope.overAll = data 
    })

    // 获取所有人的结班报告
    overData.getTodayData($stateParams.id).then(function(odata){
        $scope.overs = odata.overs 
        console.log(odata.overs)
    })

    //获取微信支付金额
    domainData.getShopidData().then(function(data){
        payorderData.getData(data.shopid,$stateParams.id).then(function(wxdata){
            $scope.wxpospay = wxdata.wxpospay
        })
    })

    //获取支付宝支付金额
    domainData.getShopidData().then(function(data){
        payorderData.getAlipayData(data.shopid,$stateParams.id).then(function(alipaydata){
            $scope.alipospay = alipaydata.alipospay
        })
    })
    
    $scope.nowtime = new Date().getTime()
    $scope.printOver = function(){
        $scope.nowtime = new Date().getTime()
        console.log($scope.nowtime)
        printFunc('print-over')
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