/********************************************************************************************************************
 *                                                      成员详情页面
 ********************************************************************************************************************/

angular.module("petruleDetailMoudle", []).controller('PetruleDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','settingData',
    function($scope,$window, $http, $stateParams,$alert,settingData) {
    $window.document.title = "收银员详情";
    $scope.isEdit = true;
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ]
    $scope.roles = [
        {"value":0,"label":"收银员"},
        {"value":1,"label":"财务"},
        {"value":2,"label":"其他"}
    ]
    settingData.getIdData($stateParams.id).then(function (data) {
       $scope.user=data.user
    });

    $scope.saveUser = function(value){
    	settingData.updatecopyData(value).then(function(data){
			$scope.changeAlert(data.msg)
        })
    } 

}]) 
 

