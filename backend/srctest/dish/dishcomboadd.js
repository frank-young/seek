/********************************************************************************************************************
 *                                                      新建套餐页面
 ********************************************************************************************************************/

angular.module("dishcomboAddMoudle", []).controller('DishcomboAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData',
    function($scope,$window, $http, $state,$alert,dishData,cateData) {
	$window.document.title = "添加套餐"
    /*套餐分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })

    if(localStorage.dish){
        $scope.dish = JSON.parse(localStorage.dish)
    }else{
        $scope.dish ={   
            "isTop":false,
            "checked":false,
            "isChecked":false,
            "number":0,
            // "memberPrice": 0,
            "reducePrice": null,
            // "comboPrice": 0,
            // "otherPrice": 0,
            "name":"",
            "price":null,
            "cate":"0",
            "search":"",
            "ishost":false,
            "other1":"", 
            "other2":"", 
            "description":"",
            "history":'添加套餐'
        }
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.dish= JSON.stringify($scope.dish);
    }, 6000);

    $scope.saveDish = function(value){
        dishData.addData(value).then(function(data){
            if(data.status==1){
                $scope.changeAlert(data.msg)
                window.history.go(-1)
                localStorage.removeItem("dish") 
                clearInterval(time)
            }else{
                $scope.changeAlert(data.msg)
            }
            
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
            $scope.changeAlert(data.msg);
        })
        cateData.getData().then(function (data) {
            $scope.cate = data.cates
        })
    }
}])