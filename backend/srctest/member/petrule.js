/********************************************************************************************************************
 *                                                      会员列表页面
 ********************************************************************************************************************/

angular.module("petruleMoudle", []).controller('PetruleCtrl', 
    ['$scope','$window', '$http', '$state','$alert','petruleData',
    function($scope,$window, $http, $state,$alert,petruleData) {
        $window.document.title = "储值卡套餐管理";

    petruleData.getData().then(function(data){
    	$scope.petrules = data.petrules

    })

    /*分页*/
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;


}])


