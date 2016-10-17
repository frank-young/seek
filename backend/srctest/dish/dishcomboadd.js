/********************************************************************************************************************
 *                                                      新建套餐页面
 ********************************************************************************************************************/

angular.module("dishcomboAddMoudle", []).controller('DishcomboAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData',
    function($scope,$window, $http, $state,$alert,dishData,cateData) {
	$window.document.title = "添加套餐"
    /*套餐分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates
    })

    // 所有菜品
    $scope.dishAll = []
    dishData.getData().then(function(data){

        data.dishs.forEach(function(ele,index){
            if(ele.other1 != 1){
                var d = {
                    value:ele._id,
                    label:ele.name,
                    price:ele.price
                }
                $scope.dishAll.push(d)
            }
           
        })
    })

    if(localStorage.dishcombo){
        $scope.dish = JSON.parse(localStorage.dishcombo)
    }else{
        $scope.dish ={   
            "isTop":false,
            "checked":false,
            "isChecked":false,
            "number":0,
            "reducePrice": null,
            "name":"",
            "cate":0,
            "price":null,
            "search":"",
            "ishost":false,
            "other1":1, 
            "other2":"", 
            "description":"",
            "history":'添加套餐'
        }
    }

    $scope.dish.dishArr = [{dishSelect:"",dishPrice:null}]

    $scope.addDish = function(){
        $scope.dish.dishArr.push({dishSelect:"",dishPrice:null})
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.dishcombo= JSON.stringify($scope.dish);
    }, 6000);

    $scope.saveDish = function(value){
        dishData.addData(value).then(function(data){
            if(data.status==1){
                $scope.changeAlert(data.msg)
                window.history.go(-1)
                localStorage.removeItem("dishcombo") 
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