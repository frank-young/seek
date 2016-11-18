/********************************************************************************************************************
 *                                                      账号设置
 ********************************************************************************************************************/

angular.module("selfsetMoudle", []).controller('SelfetCtrl', 
    ['$scope','$window', '$http','$alert','domainData','settingData',
    function($scope,$window, $http,$alert, domainData,settingData) {
    $window.document.title = "账号设置";

    $scope.setting={
        password:"",
        newpassword:"",
        surepassword:""
    }

    $scope.saveSetting = function(value){
        console.log(value)
        settingData.selfsetData(value).then(function(data){
            $scope.changeAlert(data.msg)
        })
    }

}]) 
 

 