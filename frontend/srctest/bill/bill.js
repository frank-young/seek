/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', ['$scope','$window',
  	function($scope,$window) {

		$window.document.title = "结账"; 
		$scope.cookCart = JSON.parse(localStorage.cook)

		$scope.total = 0
		// $scope.reduce = 0
		// $scope.discount = 0
		$scope.totalReal = 0

		$scope.cookCart.forEach(function(ele){
			$scope.total += ele.number*ele.price
		})

		$scope.totalReal = angular.copy($scope.total)

		$scope.discountFunc = function(value){
			$scope.totalReal = $scope.total*value*0.01
		}

		$scope.reduceFunc = function(value){
			$scope.totalReal = $scope.total - value
		}

		$scope.freeFunc = function(value){
			$scope.totalReal = 0
		}

		$scope.billing = function(){
			// localStorage.removeItem('cook')
			// localStorage.removeItem('cookAll')
			// window.location.href="#/index"
		}
	}
])



