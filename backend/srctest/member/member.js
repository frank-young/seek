/********************************************************************************************************************
 *                                                      储值卡套餐列表页面
 ********************************************************************************************************************/

angular.module("teamMoudle", []).controller('TeamCtrl', 
    ['$scope','$window', '$http', '$state','$alert','settingData',
    function($scope,$window, $http, $state,$alert,settingData) {
        $window.document.title = "储值卡套餐管理";

    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){ 
            if (obj[i] == current) {
                return i;
            }
        }
    }

    

    /*分页*/
    $scope.itemsPerPage = 8;

    $scope.currentPage = 1;


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
    /* 删除储值卡套餐 */
    $scope.deleteTeam = function(value){
        var deleteConfirm = confirm('您确定要删除这个储值卡套餐吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.user);
            $scope.user.splice(index,1);   //删除
            settingData.deleteData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.user){
            $scope.user[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.user){
                $scope.checkArr.push($scope.user[i]);
                $scope.user[i].isChecked = true;
                
            }
    } 
    /* 删除栏目 ----批量操作 */
    $scope.deleteTeamAll = function(value){
        var deleteConfirm = confirm('您确定要删除这个储值卡套餐吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.user);
                $scope.user[index].isChecked = false;  //去掉标记位
                $scope.user.splice(index,1);   //删除
                settingData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        } 
    } 

}])


