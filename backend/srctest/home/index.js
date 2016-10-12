/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$window','orderData',
  	function($scope,$window,orderData) {

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
	  	

	}
])



