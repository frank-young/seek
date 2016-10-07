/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', ['$scope','$window',
  	function($scope,$window) {

		$window.document.title = "结账"; 
		// 获取本地存储已点的菜品
		$scope.cookCart = JSON.parse(localStorage.cook)

		$scope.info = {
			address:'天津商业大学店',
			number:'B34067201610010001',
			time: new Date(),
			status:'已确认',
			people:2
		} 

		$scope.memberAll = [
			{
				name:'徐奥林',
				phone:'18694039343',
				time:1492837482382

			},
			{
				name:'杨军',
				phone:'18608164404',
				time:1492837482382

			},
			{
				name:'刘洋',
				phone:'18694033083',
				time:1492837482382

			},
			{
				name:'徐奥林',
				phone:'18694039183',
				time:1492837482382

			},
			{
				name:'徐奥林',
				phone:'18691239283',
				time:1492837482382

			},
			{
				name:'徐奥林',
				phone:'1869445683',
				time:1492837482382

			},
			{
				name:'徐奥林',
				phone:'1869384283',
				time:1492837482382

			},

		]

		$scope.total = 0
		$scope.totalReal = 0

		// 总价格，实际价格
		$scope.cookCart.forEach(function(ele){
			$scope.total += ele.number*ele.price
		})

		// 折后、减免、免单后的真实价格
		$scope.totalReal = angular.copy($scope.total)

		// 打折
		$scope.discountFunc = function(value){
			$scope.totalReal = $scope.total*value*0.01
		}

		// 减价
		$scope.reduceFunc = function(value){
			$scope.totalReal = $scope.total - value
		}
		// 免单
		$scope.freeFunc = function(value){
			$scope.totalReal = 0
		}

		// 结算
		$scope.billing = function(){
			var ele = document.getElementById('print')
			document.getElementsByTagName('body')[0].appendChild(ele)
			window.print()

			localStorage.removeItem('cook')
			localStorage.removeItem('cookAll')
			window.location.href="#/index"
		}

		// 搜索会员用户
		$scope.search = ""
		$scope.searchMember = function(value){
			$scope.member = $scope.memberAll.filter(function(ele){
				if(ele.phone.indexOf($scope.search)>=0){
					console.log(ele.phone)
					return ele
				}
			})
		}

	}
])









