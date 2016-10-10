/********************************************************************************************************************
 *                                                      添加成员页面
 ********************************************************************************************************************/

angular.module("teamAddMoudle", []).controller('TeamAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','settingData',
    function($scope,$window, $http, $state,$alert,settingData) {
    $window.document.title = "添加收银员";
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ];
    $scope.user = {
					name:"",
					email:"",
					password:"",
					section:"",
					position:"",
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
                window.history.go(-1);
        });
    }

    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
}])


