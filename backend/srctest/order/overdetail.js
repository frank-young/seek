/********************************************************************************************************************
 *                                                      品项报告详情页面
 ********************************************************************************************************************/

angular.module("overDetailMoudle", []).controller('OverDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','orderData','itemData','overData','domainData',
    function($scope,$window, $http, $stateParams,$alert,orderData,itemData,overData,domainData) {
	$window.document.title = "品项报告详情"

    orderData.getGradeAllData().then(function(data){
        $scope.todayData.overAll = data 
    })

    // 获取所有人的结班报告
    overData.getTodayData().then(function(data){
        $scope.todayData.overs = data.overs 
    })

    //获取微信支付金额
    domainData.getShopidData().then(function(data){
        payorderData.getData(data.shopid).then(function(wxdata){
            $scope.todayData.wxpospay = wxdata.wxpospay
        })
    })

    //获取支付宝支付金额
    domainData.getShopidData().then(function(data){
        payorderData.getAlipayData(data.shopid).then(function(alipaydata){
            $scope.todayData.alipospay = alipaydata.alipospay
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