/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', 
  ['$scope','$window',
  function($scope,$window) {

	  $window.document.title = "结账"; 
	  $scope.cookCart = JSON.parse(localStorage.cook)
	  

}])



