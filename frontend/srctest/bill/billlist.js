/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("billlistMoudle", []).controller('BilllistCtrl', ['$scope','$window','orderData','dishData',
  	function($scope,$window,orderData,dishData) {

		$window.document.title = "订单列表"; 
		orderData.getData().then(function(data){
			$scope.orders = data.orders
		})
		$scope.payTypeArr = ['现金','微信','支付宝','会员卡','次卡']

		$scope.cookAll = []
		dishData.getData().then(function(data){
			$scope.cookAll = data.dishs
		})

		$scope.lookAll = function(id){
			orderData.getIdData(id).then(function(data){
				$scope.order = data.order
			})

		}
		
		// 反位结算，删除本单，重新下单
		$scope.againAccount = function(value){
			console.log(value)
			localStorage.cook = JSON.stringify(value.dish)
			localStorage.peopleNumber = value.peopleNum
			value.dish.forEach(function(v1,i1){
				$scope.cookAll.forEach(function(v2,i2){
					if(v1.name == v2.name){
						v2.checked = true
						v2.number = 1
					}
				})
			})
			localStorage.cookAll = JSON.stringify($scope.cookAll)

			orderData.deleteData(value).then(function(data){
				console.log(data)
			})
		}

		
	}
])



