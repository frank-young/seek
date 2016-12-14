/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', ['$scope','$rootScope','$window','$location','settingData','domainData','tableData',
  	function($scope,$rootScope,$window,$location,settingData,domainData,tableData) {

		$window.document.title = "seek cafe点餐系统"

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
		// 权限控制
		settingData.getRbac().then(function(data){
			$scope.role = data.rbac
		})

		domainData.getShopidData().then(function(data){
			$scope.shopid = data.shopid
  		})

  		setInterval(function(){
  			tableData.getData('seek01').then(function(data){
  				
  			})
  		},1000)
		
	}
])



