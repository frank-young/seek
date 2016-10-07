/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("billlistMoudle", []).controller('BilllistCtrl', ['$scope','$window',
  	function($scope,$window) {

		$window.document.title = "订单列表"; 
		$scope.bills=[
			{
				number:'A001',
				total:76,
				time: new Date(),

			},
			{
				number:'A002',
				total:106,
				time: new Date(),

			},
			{
				number:'A003',
				total:28,
				time: new Date(),

			},
			{
				number:'A004',
				total:32,
				time: new Date(),

			},
		]
	}
])



