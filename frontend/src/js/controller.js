/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', 
  ['$scope','$window',
  function($scope,$window) {

	  $window.document.title = "结账"; 
	  $scope.cookCart = JSON.parse(localStorage.cook)
	  

}])



;/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$window',
  function($scope,$window) {

	  $window.document.title = "seek cafe";

}])



;/********************************************************************************************************************
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
		$scope.cookAll = [
			{"name":"拿铁咖啡","price":"32.00","cate":0,"checked":false},
			{"name":"南山咖啡","price":"32.00","cate":0,"checked":false},
			{"name":"雀巢咖啡","price":"32.00","cate":0,"checked":false},
			{"name":"摩卡咖啡","price":"32.00","cate":0,"checked":false},
			{"name":"卡布奇诺","price":"32.00","cate":0,"checked":false},
			{"name":"焦糖玛奇朵","price":"32.00","cate":0,"checked":false},
			{"name":"马卡龙","price":"32.00","cate":1,"checked":false},
			{"name":"蛋糕","price":"32.00","cate":2,"checked":false},
			{"name":"冰淇淋","price":"32.00","cate":1,"checked":false},
			{"name":"冰糖雪梨","price":"32.00","cate":3,"checked":false},
		]
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

		if(localStorage.cook!=""){
			$scope.cookCart = JSON.parse(localStorage.cook)
		}else{
			$scope.cookCart = []	// 选中的菜品

		}
		$scope.selectCook = function(value){	//选择分类
			value.checked = !value.checked		//添加选中标示
			
			$scope.cookCart = $scope.cookAll.filter(function(ele){	//使用 filter 过滤出 checked = true 的对象
				if(ele.checked==true){
					return ele
				}
			})
		}

		$scope.add = function(){

		}
		$scope.reduce = function(){

		}

		$scope.save = function(){	// 保存菜品到localStorage
			localStorage.cook = JSON.stringify($scope.cookCart)
		}

	}
])








