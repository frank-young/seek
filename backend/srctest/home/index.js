/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$window','orderData','settingData','petcardData',
  	function($scope,$window,orderData,settingData,petcardData) {

	  	$window.document.title = "seek cafe";
	  	var date = new Date()
	  	$scope.year = date.getFullYear()
	  	$scope.month = date.getMonth()+1
	  	var value = {
	  		"year": $scope.year,
	  		"month": $scope.month
	  	}
	  	orderData.downloadData(value).then(function(data){
	  		$scope.link = data.link
	  		$scope.file = data.file
	  	})

	  	// $scope.memberNum
	  	//总业绩查询
	  	orderData.getGradeTodayData().then(function(data){
	  		$scope.data = data
	  	})
	  	// 权限控制
		settingData.getRbac().then(function(data){
			$scope.role = data.rbac
		})

		petcardData.getTodayOrderData().then(function(data){
	  		$scope.fee = data.fee
	  		$scope.bonus = data.bonus

	  	})

	}
])



