/********************************************************************************************************************
 *                                                      餐桌管理
 ********************************************************************************************************************/
angular.module("tableMoudle", []).controller('TableCtrl', 
    ['$scope','$window', '$http', '$state','$alert','tableData',
    function($scope,$window, $http, $state,$alert,tableData) {
        $window.document.title = "储值卡套餐管理";

        // $scope.qrcode = "../../table/qrcode?text=http://frankyoung.s1.natapp.link/mobile/ordering/"
	 	$scope.qrcode = "../../table/qrcode?text=https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx782db8ee3e80c4aa%26redirect_uri=http%3A%2F%2Fwx.wn50.cn%2Fapi%2Ftable%2F"

        $scope.qrcodeStill = "%26response_type=code%26scope=snsapi_userinfo%26state=STATE#wechat_redirect"
	    tableData.getData().then(function(data){ 
	    	$scope.tables = data.tables

	    })

	    /*分页*/
	    $scope.itemsPerPage = 30;
	    $scope.currentPage = 1;

	}
])


