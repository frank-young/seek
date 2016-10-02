/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', ['$scope','$window',
  	function($scope,$window) {

		$window.document.title = "结账"; 
		$scope.cookCart = JSON.parse(localStorage.cook)

		$scope.total = 0
		// $scope.reduce = 0
		// $scope.discount = 0
		$scope.totalReal = 0

		$scope.cookCart.forEach(function(ele){
			$scope.total += ele.number*ele.price
		})

		$scope.totalReal = angular.copy($scope.total)

		$scope.discountFunc = function(value){
			$scope.totalReal = $scope.total*value*0.01
		}

		$scope.reduceFunc = function(value){
			$scope.totalReal = $scope.total - value
		}

		$scope.freeFunc = function(value){
			$scope.totalReal = 0
		}

		$scope.billing = function(){
			localStorage.removeItem('cook')
			localStorage.removeItem('cookAll')
			window.location.href="#/index"
		}
	}
])



;/********************************************************************************************************************
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



;/********************************************************************************************************************
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



  ;/********************************************************************************************************************
 *                                                     点餐页面
 ********************************************************************************************************************/

angular.module("selectMoudle", []).controller('SelectCtrl', ['$scope','$window',
	function($scope,$window) {

		$window.document.title = "点餐";

		$scope.cate = [
			{"value":0,"name":"咖啡","checked":true},
			{"value":1,"name":"甜品","checked":false},
			{"value":2,"name":"零食","checked":false},
			{"value":3,"name":"特色菜品","checked":false}
		]

		if(localStorage.cookAll !=null){
			$scope.cookAll = JSON.parse(localStorage.cookAll)
		}else{

			$scope.cookAll = [
				{"name":"拿铁咖啡","price":"28.00","cate":0,"checked":false,"number":0,"search":"ntkf"},
				{"name":"南山咖啡","price":"18.00","cate":0,"checked":false,"number":0,"search":"nskf"},
				{"name":"雀巢咖啡","price":"16.00","cate":0,"checked":false,"number":0,"search":"qckf"},
				{"name":"摩卡咖啡","price":"25.00","cate":0,"checked":false,"number":0,"search":"mkkf"},
				{"name":"卡布奇诺","price":"28.00","cate":0,"checked":false,"number":0,"search":"kbqn"},
				{"name":"焦糖玛奇朵","price":"32.00","cate":0,"checked":false,"number":0,"search":"jtmqd"},
				{"name":"马卡龙","price":"12.00","cate":1,"checked":false,"number":0,"search":"mkl"},
				{"name":"蛋糕","price":"56.00","cate":2,"checked":false,"number":0,"search":"dg"},
				{"name":"冰淇淋","price":"6.00","cate":1,"checked":false,"number":0,"search":"bql"},
				{"name":"冰糖雪梨","price":"6.00","cate":3,"checked":false,"number":0,"search":"btxl"}
			]
		}

		$scope.cook = []	// 分类显示的菜品
		function selectDefault(value){	
			$scope.cookAll.forEach(function(ele,index){
				if(ele.cate == value){
					$scope.cook.push(ele)
				}
			})
		}

		selectDefault(0)	//默认选择第一个分类

		$scope.selectCate = function(value){	//选择分类
			$scope.cook = [];
			$scope.cate.forEach(function(ele,index){
				ele.checked = false
			})
			selectDefault(value.value)
			value.checked = true
		}

		$scope.search = ""
		$scope.searchFunc = function(value){	// 搜索
			// $scope.cook = $scope.cookAll
			$scope.cook = $scope.cookAll.filter(function(ele){
				if(ele.search.indexOf($scope.search)>=0){
					return ele
				}
			})
		}

		if(localStorage.cook!=null){
			$scope.cookCart = JSON.parse(localStorage.cook)
		}else{
			$scope.cookCart = []	// 选中的菜品

		}
		$scope.selectCook = function(value){	//选择菜品
			value.checked = !value.checked		//添加选中标示
			value.number = 1	// 设置选择的默认数量

			$scope.cookCart = $scope.cookAll.filter(function(ele){	//使用 filter 过滤出 checked = true 的对象
				if(ele.checked==true){
					return ele
				}
			})
		}

		$scope.add = function(value){
			value.number += 1
		}
		$scope.reduce = function(value){
			value.number -= 1
			console.log('reduce')
			if(value.number <= 0){
				$scope.cookCart = $scope.cookCart.filter(function(ele){
					if(ele.number!=0){
						return ele
					}
				})
				$scope.cookAll.forEach(function(ele,index){
					if(ele.number <= 0){ 
						ele.checked = false
						ele.number = 0
						// console.log(ele)
					}
					if(value.name == ele.name&&value.number == 0){
						ele.number = 0
						ele.checked = false
					}
				})
				// localStorage.cookAll = JSON.stringify($scope.cookAll)

			}
		}

		$scope.save = function(){	// 保存菜品到localStorage
			localStorage.cook = JSON.stringify($scope.cookCart)
			localStorage.cookAll = JSON.stringify($scope.cookAll)
		}

	}
])








