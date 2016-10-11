/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("billlistMoudle", []).controller('BilllistCtrl', ['$scope','$window','orderData',
  	function($scope,$window,orderData) {

		$window.document.title = "订单列表"; 
		orderData.getData().then(function(data){
			$scope.orders = data.orders
		})
		$scope.payTypeArr = ['现金支付','微信支付','支付宝支付','会员卡支付']

		$scope.lookAll = function(id){
			orderData.getIdData(id).then(function(data){
				$scope.order = data.order
			})

		}
		
	}
])



