/********************************************************************************************************************
 *                                                      产品分类页面
 ********************************************************************************************************************/

angular.module("dishCateMoudle", ['ng-sortable']).controller('DishCateCtrl', 
    ['$scope','$window', '$http', '$alert','$state','cateData',
    function($scope,$window, $http,$alert, $state,cateData) {
	$window.document.title = "菜品分类"
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        } 
    } 
    /*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    /* 添加分类信息 */
    $scope.addCate= function(){
        var value = $scope.cate.length
        var msgadd = {
            checked: false,
            isEdit: true,
            value:value,
            label:'新添分类'+(value+1)
        }
        cateData.addData(msgadd).then(function(data){
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates;
            })
            $scope.changeAlert(data.msg);
        });
        
    }
    /* 保存单条分类信息 */
    $scope.saveCate= function(value){
        if(value.isEdit == true){
            cateData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        } 
    }
    /* 删除单条分类信息 */
    $scope.deleteCate= function(value){
        var deleteConfirm = confirm('您确定要删除这个分类吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.cate);
            $scope.cate.splice(index,1);   //删除
            cateData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.cate.forEach( function(element, index) {
                element.value = index;
                cateData.updateData(element);
            });
        }
    }

}]);