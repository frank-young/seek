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

    settingData.getPhone().then(function(data){
        $scope.setting.phone = data.phone
        $scope.setting.name = data.name
    })

    $scope.saveSetting = function(value){
        settingData.selfsetData(value).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                setTimeout(function(){
                    $window.location.href="/logout"
                },2000)
            }
        })
    }

}]) 
 

 