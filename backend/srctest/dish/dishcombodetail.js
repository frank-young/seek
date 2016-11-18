/********************************************************************************************************************
 *                                                      菜品详情页面
 ********************************************************************************************************************/

angular.module("dishcomboDetailMoudle", []).controller('DishcomboDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','$filter','dishData','cateData',
    function($scope,$window, $http, $stateParams,$alert,$filter,dishData,cateData) {
	$window.document.title = "菜品详情";
    /* 是否可编辑 */
	$scope.isEdit = true;
	/*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    }) 

    var date = new Date()
    /* 菜品详情请求 */
    dishData.getIdData($stateParams.id).then(function (data) {
       $scope.dish=data.dish

    })
    // 所有菜品
    $scope.dishAll = []
    dishData.getData().then(function(data){

        data.dishs.forEach(function(ele,index){
            if(ele.other1 != 1){
               
                var d = {
                    value:ele.name,
                    label:ele.name + ' （原价：' +  $filter('currency')(ele.price,'￥') +'）',
                    price:ele.price
                }
                $scope.dishAll.push(d)
            }
           
        })

    })
   
    // 监听价格，更新套餐总价
    $scope.$watch('dish.dishArr', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var sum = 0 
            $scope.dish.dishArr.forEach(function(ele){
                sum += parseFloat(ele.dishPrice)
            })
            $scope.dish.price = angular.copy(sum)
        }
       
    },true)

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

    $scope.cloneCombo = function(){
        localStorage.dishcombo= JSON.stringify($scope.dish);

    }

}]);