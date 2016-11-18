/********************************************************************************************************************
 *                                                      菜品详情页面
 ********************************************************************************************************************/

angular.module("dishDetailMoudle", []).controller('DishDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','$filter','dishData','cateData',
    function($scope,$window, $http, $stateParams,$alert,$filter,dishData,cateData) {
	$window.document.title = "菜品详情";
    /* 是否可编辑 */
	$scope.isEdit = true;
	/*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    }) 
    $scope.isSale = [
        {value:"0",label:"是"},
        {value:"1",label:"否"}
    ]

    var date = new Date()
    /* 菜品详情请求 */
    dishData.getIdData($stateParams.id).then(function (data) {
       $scope.dish=data.dish

    })

    $scope.saveDish = function(value){
        dishData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }
   
    /* 添加分類 */
    $scope.saveCate = function(value){
         
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true,
            "checked":false
        }

        cateData.addData(msgadd).then(function(data){
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates;

            });
            $scope.changeAlert(data.msg);
        });
        
    }

    $scope.clone = function(){
        localStorage.dish= JSON.stringify($scope.dish);
    }


}]);