/********************************************************************************************************************
 *                                                      成员详情页面
 ********************************************************************************************************************/

angular.module("petruleDetailMoudle", []).controller('PetruleDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','petruleData',
    function($scope,$window, $http, $stateParams,$alert,petruleData) {
    $window.document.title = "储值卡套餐详情";
    $scope.isEdit = true
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.uses = [
        {"value":0,"label":"启用"},
        {"value":1,"label":"禁止"}
    ]
    petruleData.getIdData($stateParams.id).then(function (data) {
       $scope.petrule=data.petrule
    });

    $scope.savePetrule = function(value){
        $scope.petrule.name = '充值'+$scope.petrule.fee+'元，赠送'+$scope.petrule.bonus+'元'
        petruleData.updateData($scope.petrule).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                window.history.go(-1)
            }
        })
    }

    $scope.deletePetrule = function(){
        var deleteConfirm = confirm('您确定要删除这个套餐吗？');
        if(deleteConfirm){
            petruleData.deleteData($stateParams.id).then(function(data){
                $scope.changeAlert(data.msg)
                if(data.status==1){
                    window.history.go(-1)
                }
            })
        }
    }

}]) 
 

