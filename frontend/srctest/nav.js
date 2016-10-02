/********************************************************************************************************************
 *                                                     导航条
 ********************************************************************************************************************/

angular.module("navMoudle", []).controller('NavCtrl', 
  ['$scope','$interval',
  function($scope,$interval) {
  	function setTime(){
  		return $scope.time = new Date()
  	}
  	$interval(function() {
  		setTime()
  	}, 1000);
    
  	setTime()
}])



  