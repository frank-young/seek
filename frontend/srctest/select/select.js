/********************************************************************************************************************
 *                                                     点餐页面
 ********************************************************************************************************************/

angular.module("selectMoudle", []).controller('SelectCtrl', ['$scope','$window','cateData','dishData',
	function($scope,$window,cateData,dishData) {

		$window.document.title = "点餐"
		
		//获取分类
		if(localStorage.localCate !=null){
			$scope.localCate = JSON.parse(localStorage.localCate)
		}else{
			$scope.cate = []
			cateData.getData().then(function(data){
				$scope.cate = data.cates
				$scope.cate[0].checked = true
			})
		}

		//获取菜品
		if(localStorage.cookAll !=null){
			$scope.cookAll = JSON.parse(localStorage.cookAll)

		}else{
			$scope.cookAll = []
			$scope.cook = []
			dishData.getData().then(function(data){
				$scope.cookAll = data.dishs
				// $scope.cook = angular.copy($scope.cookAll)
				selectDefault(0)
			})
		}

		$scope.cook = []
		
		//选择默认分类
		function selectDefault(value){	
			$scope.cookAll.forEach(function(ele,index){
				if(ele.cate == value){
					$scope.cook.push(ele)
				}
			})

		}

		selectDefault(0)	//默认选择第一个分类

		//选择分类
		$scope.selectCate = function(value){	
			$scope.cook = [];
			$scope.cate.forEach(function(ele,index){
				ele.checked = false
			})
			selectDefault(value.value)
			value.checked = true
		}
		 
		// 搜索
		$scope.search = ""
		$scope.searchFunc = function(value){
			// $scope.cook = $scope.cookAll
			$scope.cook = $scope.cookAll.filter(function(ele){
				if(ele.search.indexOf($scope.search)>=0){
					return ele
				}
			})
		}

		// 从本地读取菜品，从确认订单页面返回时需要
		if(localStorage.cook!=null){
			$scope.cookCart = JSON.parse(localStorage.cook)
		}else{
			$scope.cookCart = []

		}
		//选择菜品
		$scope.selectCook = function(value){	
			value.checked = !value.checked		//添加选中标示
			value.number = 1	// 设置选择的默认数量

			$scope.cookCart = $scope.cookAll.filter(function(ele){	//使用 filter 过滤出 checked = true 的对象
				if(ele.checked==true){
					return ele
				}
			})
		}

		// 增加菜品数量
		$scope.add = function(value){
			value.number += 1
		}

		// 减少菜品数量
		$scope.reduce = function(value){
			value.number -= 1
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
					if(value.name == ele.name&&value.number == 0){	// 需要考虑从bill页面返回过来时的状态
						ele.number = 0
						ele.checked = false
					}
				})
				// localStorage.cookAll = JSON.stringify($scope.cookAll)

			}
		}

		// 选中菜品
		$scope.save = function(){	// 保存菜品到localStorage
			localStorage.cook = JSON.stringify($scope.cookCart)
			localStorage.cookAll = JSON.stringify($scope.cookAll)
		}

	}
])








