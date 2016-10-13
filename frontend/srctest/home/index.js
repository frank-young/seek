/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', ['$scope','$rootScope','$window','$location','dayData',
  	function($scope,$rootScope,$window,$location,dayData) {

		$window.document.title = "seek cafe";
		var date = new Date(),
			Y = date.getFullYear(),	
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()),
	        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()),
	        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()),
	        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()),
			today = Y + M + D


		// 选择用餐人数
		$scope.people = [1,2,3,4,5,6,7,8,9,10,11,12]
		$scope.pNum = 1
		$scope.showNumber = function(value){
			$scope.pNum = value
		}
		//开始点餐，
		$scope.start = function(){
			//存储用餐人数
			localStorage.peopleNumber = $scope.pNum
			//删除已有的本地菜品纪录
		  	localStorage.removeItem('cookAll')
		  	localStorage.removeItem('cook')
		  	$window.location.href="#/select"
		}
		
	}
])



