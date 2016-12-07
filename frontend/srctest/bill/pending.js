/********************************************************************************************************************
 *                                                     未付款订单
 ********************************************************************************************************************/

angular.module("pendingMoudle", []).controller('PendingCtrl', ['$scope','$window','orderData','dishData','settingData','paytypeData','itemData',
  	function($scope,$window,orderData,dishData,settingData,paytypeData,itemData) {
  		$scope.show = false

		orderData.getPendingData().then(function(data){
			$scope.orders = data.orders
		})

		$scope.cookAll = []
		dishData.getData().then(function(data){
			$scope.cookAll = data.dishs
		})

		$scope.lookAll = function(value){
			$scope.show = true
			orderData.getIdData(value._id).then(function(data){
				$scope.order = data.order
			})
		}
  		
		
		// 删除本单，重新下单
		$scope.againAccount = function(value){
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
				$scope.changeAlert("成功！")
			})

			itemData.deletesomeData(value.orderNum).then(function(data){

			})

		}

	}
])



