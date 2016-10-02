/********************************************************************************************************************
 *                                                     导航条
 ********************************************************************************************************************/

angular.module("navMoudle", []).controller('NavCtrl', ['$scope','$rootScope','$interval',
  	function($scope,$rootScope,$interval) {
	  	function setTime(){
	  		return $scope.time = new Date()
	  	}
	  	$interval(function() {
	  		setTime()
	  	}, 1000)
	  	setTime()

	  	$rootScope.status = true;
	  	$scope.startDay = function(){
	  		$rootScope.status = false

	  		$scope.time = new Date()	// 开班时间
	  		console.log($scope.time)
	  	}
	  	$scope.stopDay = function(){
	  		$rootScope.status = true
	  		
	  		$scope.time = new Date()	// 结班时间
	  		console.log($scope.time)

	  		window.location.href="#/index"
	  	}

	}
])



  