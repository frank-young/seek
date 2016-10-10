    /********************************************************************************************************************
 *                                                      全部菜品页面
 ********************************************************************************************************************/

angular.module("dishMoudle", []).controller('DishCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData',
    function($scope,$window, $http, $state,$alert,dishData,cateData) {
	$window.document.title = "菜品列表"
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
	$scope.allShow = false;
	$scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow
    }
	/* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }  
    }    
	/*分页*/
    $scope.itemsPerPage = 5;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;
    /*产品*/
    dishData.getData().then(function(data){
        $scope.dish=data.dishs;
    })
    /*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        dishData.updateData(value);
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }

    /***************************** 以下是顶部导航栏批量操作 **************************************/
    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
    }
    /* 删除单件产品 */
    $scope.deleteDish = function(value){
        var deleteConfirm = confirm('您确定要删除这件产品吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.dish);
            $scope.dish.splice(index,1);   //删除
            dishData.deleteData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.dish){
            $scope.dish[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.dish){
                $scope.checkArr.push($scope.dish[i]);
                $scope.dish[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.dish);
            $scope.dish[index].isTop = true;      //固定
            $scope.dish[index].isChecked = false;  //去掉标记位，也就是去掉勾
            dishData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.dish);
            $scope.dish[index].isTop = false;      //取消固定
            $scope.dish[index].isChecked = false;  //去掉标记位，也就是去掉勾
            dishData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 删除栏目 ----批量操作 */
    $scope.deletedish = function(value){
        var deleteConfirm = confirm('您确定要删除这件产品吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.dish);
                $scope.dish[index].isChecked = false;  //去掉标记位
                $scope.dish.splice(index,1);   //删除
                dishData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
}])