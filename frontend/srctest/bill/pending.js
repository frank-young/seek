// /********************************************************************************************************************
//  *                                                     未付款订单
//  ********************************************************************************************************************/

// angular.module("pendingMoudle", []).controller('PendingCtrl', ['$scope','$window','orderData','dishData','settingData','paytypeData','itemData',
//   	function($scope,$window,orderData,dishData,settingData,paytypeData,itemData) {

// 		orderData.getData().then(function(data){
// 			$scope.orders = data.orders
// 		})

// 		$scope.payTypeArr = []
// 		//获取支付方式
// 		paytypeData.getData().then(function(data){
// 			$scope.payTypeArr = data.paytypes.map(function(value){
// 				return value.label
// 			})
// 		})

// 		$scope.cookAll = []
// 		dishData.getData().then(function(data){
// 			$scope.cookAll = data.dishs
// 		})

// 		$scope.lookAll = function(id){
// 			orderData.getIdData(id).then(function(data){
// 				$scope.order = data.order
// 			})
// 		}
		
// 		// 反位结算，删除本单，重新下单
// 		$scope.againAccount = function(value){
// 			localStorage.cook = JSON.stringify(value.dish)
// 			localStorage.peopleNumber = value.peopleNum
// 			value.dish.forEach(function(v1,i1){
// 				$scope.cookAll.forEach(function(v2,i2){
// 					if(v1.name == v2.name){
// 						v2.checked = true
// 						v2.number = 1
// 					}
// 				})
// 			})
// 			localStorage.cookAll = JSON.stringify($scope.cookAll)

// 			orderData.deleteData(value).then(function(data){
// 				$scope.changeAlert("反位结算成功！")
// 			})

// 			itemData.deletesomeData(value.orderNum).then(function(data){

// 			})

// 		}

// 	}
// ])



