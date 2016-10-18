/********************************************************************************************************************
 *                                                      新建套餐页面
 ********************************************************************************************************************/

angular.module("dishcomboAddMoudle", []).controller('DishcomboAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','$filter','dishData','cateData',
    function($scope,$window, $http, $state,$alert,$filter,dishData,cateData) {
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
                    value:ele.name,
                    label:ele.name + ' （原价：' +  $filter('currency')(ele.price,'￥') +'）',
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
            "price":0,
            "dishArr":[],
            "search":"",
            "ishost":"2",
            "other1":1,     //标记是否是套餐
            "other2":"", 
            "description":"",
            "history":'添加套餐'
        }
    }

    $scope.dish.dishArr = [{dishSelect:"",dishPrice:null}]
    
    // 添加新菜品
    $scope.addDish = function(){
        $scope.dish.dishArr.push({dishSelect:"",dishPrice:0})
    }

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

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.dishcombo= JSON.stringify($scope.dish)
    }, 6000)

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