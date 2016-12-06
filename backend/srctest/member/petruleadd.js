/********************************************************************************************************************
 *                                                      添加储值卡套餐页面
 ********************************************************************************************************************/

angular.module("petruleAddMoudle", []).controller('PetruleAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','petruleData',
    function($scope,$window, $http, $state,$alert,petruleData) {
    $window.document.title = "添加储值卡套餐";
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.uses = [
        {"value":0,"label":"启用"},
        {"value":1,"label":"禁止"}
    ]
    $scope.petrule = {
                    fee:100,
                    bonus:20,
                    consume:1,
                    int:1,
                    status:0
                }
    $scope.savePetrule = function(value){
        $scope.petrule.name = '充值'+$scope.petrule.fee+'元，赠送'+$scope.petrule.bonus+'元'
        petruleData.addData($scope.petrule).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                window.history.go(-1)
            }
        })
    }
}])


