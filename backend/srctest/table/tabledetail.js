/********************************************************************************************************************
 *                                                      添加餐桌
 ********************************************************************************************************************/

angular.module("tableDetailMoudle", []).controller('TableDetailCtrl',  
    ['$scope','$window', '$http', '$stateParams', '$state','$alert','tableData',
    function($scope,$window, $http, $stateParams, $state,$alert,tableData) {
    $window.document.title = "编辑餐桌" 

    tableData.getIdData($stateParams.id).then(function(data){
        $scope.table = data.table
    })

    $scope.deleteTable = function(){
        var deleteConfirm = confirm('您确定要删除吗？');
        if(deleteConfirm){
            tableData.deleteData($stateParams.id).then(function(data){
                $scope.changeAlert(data.msg)
                if(data.status===1){
                    window.history.go(-1)
                }
            })
        }
    }

    $scope.saveTable = function(value){
        tableData.updateData($scope.table).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status===1){
                window.history.go(-1)
            }
        })
    }
}])


