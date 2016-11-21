/********************************************************************************************************************
 *                                                      添加成员页面
 ********************************************************************************************************************/

angular.module("petruleAddMoudle", []).controller('PetruleAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','settingData',
    function($scope,$window, $http, $state,$alert,settingData) {
    $window.document.title = "添加收银员";
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.roles = [
        {"value":0,"label":"收银员"},
        {"value":1,"label":"财务"},
        {"value":2,"label":"其他"}
    ]
    $scope.user = {
                    name:"",
                    email:"",
                    password:"",
                    section:"",
                    role:0,
                    tel:"",
                    phone:"",
                    fax:"",
                    sex:"0",
                    class:"0",
                    domain:"",
                    birthday:0
                }
    $scope.saveUser = function(value){
        settingData.addData(value).then(function(data){
                $scope.changeAlert(data.msg)
                if(data.status == 1){
                    window.history.go(-1);
                }
        });
    }


}])


