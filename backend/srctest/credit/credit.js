/********************************************************************************************************************
 *                                                      产品分类页面
 ********************************************************************************************************************/

angular.module("creditMoudle", ['ng-sortable']).controller('CreditCtrl', 
    ['$scope','$window', '$http', '$alert','$state','creditData',
    function($scope,$window, $http,$alert, $state,creditData) {
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
    creditData.getData().then(function(data){
        $scope.cate=data.credits;
    })
    /* 添加分类信息 */
    $scope.addCate= function(){
        var value = $scope.cate.length
        var msgadd = {
            checked: false,
            isEdit: true,
            value:value,
            label:'姓名'+(value+1)
        }
        creditData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        creditData.getData().then(function (data) {
            $scope.cate = data.credits;
        })
    }
    /* 保存单条分类信息 */
    $scope.saveCate= function(value){
        if(value.isEdit == true){
            creditData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        } 
    }
    /* 删除单条分类信息 */
    $scope.deleteCate= function(value){
        var deleteConfirm = confirm('您确定要删除这个人吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.cate);
            $scope.cate.splice(index,1);   //删除
            creditData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.cate.forEach( function(element, index) {
                element.value = index;
                creditData.updateData(element);
            });
        }
    }

}]);