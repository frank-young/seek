/********************************************************************************************************************
 *                                                      餐桌管理
 ********************************************************************************************************************/
// http://frankyoung.s1.natapp.link
angular.module("tableMoudle", []).controller('TableCtrl', 
    ['$scope','$window', '$http', '$state','$alert','tableData',
    function($scope,$window, $http, $state,$alert,tableData) {
        $window.document.title = "储值卡套餐管理";

        // $scope.qrcode = "../../table/qrcode?text=http://frankyoung.s1.natapp.link/mobile/ordering/"

	    tableData.getData().then(function(data){ 
	    	$scope.tables = data.tables
	 		$scope.qrcode = "../../table/qrcode?text=https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd95a4f3e82e0df64&redirect_uri=http%3A%2F%2Fy7gr8.ngrok.natapp.cn%2Fmobile%2Fordering%2F"+$scope.tables._id+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"

	    })

	    /*分页*/
	    $scope.itemsPerPage = 8;
	    $scope.currentPage = 1;


	}
])


