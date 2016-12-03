/********************************************************************************************************************
 *                                                      新建菜品页面
 ********************************************************************************************************************/

angular.module("dishAddMoudle", []).controller('DishAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData',
    function($scope,$window, $http, $state,$alert,dishData,cateData) {
	$window.document.title = "添加菜品"
    /*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })

    $scope.isSale = [
        {value:0,label:"是"},
        {value:1,label:"否"}
    ]

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
            "ishost":0,
            "other1":2, 
            "other2":"", 
            "description":"",
            "history":'添加菜品'
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
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates
            })
            $scope.changeAlert(data.msg)
        })
        
    }
}])