/********************************************************************************************************************
 *                                                      门店设置
 ********************************************************************************************************************/

angular.module("setMoudle", []).controller('SetCtrl', 
    ['$scope','$window', '$http','$alert','domainData',
    function($scope,$window, $http,$alert, domainData) {
    $window.document.title = "门店设置";
    $scope.isEdit = true
    
    domainData.getData().then(function(data){
        $scope.domain = data.domain
    })

    $scope.saveDomain = function(value){
        domainData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg)
        })
    }
    
}]) 
 

 