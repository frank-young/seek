/********************************************************************************************************************
 *                                                      储值卡列表页面
 ********************************************************************************************************************/

angular.module("petcardMoudle", []).controller('PetcardCtrl', 
    ['$scope','$window', '$http', '$state','$alert','petcardData',
    function($scope,$window, $http, $state,$alert,petcardData) {
        $window.document.title = "储值卡管理";

    petcardData.getData().then(function(data){
    	$scope.petcards = data.petcards

    })

    /*分页*/
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;


}])


