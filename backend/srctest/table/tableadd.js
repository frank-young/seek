/********************************************************************************************************************
 *                                                      添加餐桌
 ********************************************************************************************************************/

angular.module("tableAddMoudle", []).controller('TableAddCtrl',  
    ['$scope','$window', '$http', '$state','$alert','tableData',
    function($scope,$window, $http, $state,$alert,tableData) {
    $window.document.title = "添加餐桌" 

    $scope.table = {
                    num:"",
                }
    $scope.saveTable = function(value){
        tableData.addData($scope.table).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status===1){
                window.history.go(-1)
            }
        })
    }
}])


