/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$rootScope','$window',
  function($scope,$rootScope,$window) {

	  $window.document.title = "seek cafe";

	  $scope.start = function(){
	  	localStorage.removeItem('cookAll')
	  	localStorage.removeItem('cook')
	  }

}])



