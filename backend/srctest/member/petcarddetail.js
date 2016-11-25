/********************************************************************************************************************
 *                                                      储值卡详情页面
 ********************************************************************************************************************/

angular.module("petcardDetailMoudle", []).controller('PetcardDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','petcardData',
    function($scope,$window, $http, $stateParams,$alert,petcardData) {
    $window.document.title = "储值卡详情";
    $scope.isEdit = true
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.uses = [
        {"value":1,"label":"启用"},
        {"value":0,"label":"禁用"},
        {"value":2,"label":"挂失"}
    ]
    petcardData.getIdData($stateParams.id).then(function (data) {
       $scope.petcard=data.petcard
    })

    $scope.savePetcard = function(value){
        petcardData.updateData($scope.petcard).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                window.history.go(-1)
            }
        })
    }

}]) 
 

