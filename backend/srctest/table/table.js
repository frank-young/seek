/********************************************************************************************************************
 *                                                      餐桌管理
 ********************************************************************************************************************/
// http://frankyoung.s1.natapp.link
angular.module("tableMoudle", []).controller('TableCtrl', 
    ['$scope','$window', '$http', '$state','$alert','tableData',
    function($scope,$window, $http, $state,$alert,tableData) {
        $window.document.title = "储值卡套餐管理";

        $scope.qrcode = "../../table/qrcode?text=http://frankyoung.s1.natapp.link/mobile/ordering/"

	    tableData.getData().then(function(data){ 
	    	$scope.tables = data.tables
	 
	    })

	    /*分页*/
	    $scope.itemsPerPage = 8;
	    $scope.currentPage = 1;


	}
])


