/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("billlistMoudle", []).controller('BilllistCtrl', ['$scope','$window','orderData','dishData','settingData','paytypeData',
  	function($scope,$window,orderData,dishData,settingData,paytypeData) {

		$window.document.title = "订单列表"; 
		orderData.getData().then(function(data){
			$scope.orders = data.orders
		})

		$scope.payTypeArr = []
		//获取支付方式
		paytypeData.getData().then(function(data){
			$scope.payTypeArr = data.paytypes.map(function(value){
				return value.label
			})
		})

		$scope.cookAll = []
		dishData.getData().then(function(data){
			$scope.cookAll = data.dishs
		})
		// 权限控制
		settingData.getRbac().then(function(data){
			$scope.role = data.rbac
		})

		// 业绩查询
		orderData.getGradeData().then(function(data){
			$scope.grade = data.grade
			$scope.username = data.username
			$scope.noincome = data.noincome

		})

		$scope.lookAll = function(id){
			orderData.getIdData(id).then(function(data){
				$scope.order = data.order
			})
		}
		
		// 反位结算，删除本单，重新下单
		$scope.againAccount = function(value){
			localStorage.cook = JSON.stringify(value.dish)
			localStorage.peopleNumber = value.peopleNum
			value.dish.forEach(function(v1,i1){
				$scope.cookAll.forEach(function(v2,i2){
					if(v1.name == v2.name){
						v2.checked = true
						v2.number = 1
					}
				})
			})
			localStorage.cookAll = JSON.stringify($scope.cookAll)

			orderData.deleteData(value).then(function(data){
				console.log(data)
			})
		}

		$scope.printRec = function(value){
			printFunc(value)
		}

		// 打印函数
		function printFunc(value){
			var LODOP=getLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'))
			var ele = document.getElementById(value)

			// content.appendChild(ele)
			// window.print()
			// content.innerHTML = ""

			LODOP.ADD_PRINT_HTM(10,10,220,ele.offsetHeight,ele.innerHTML)
			LODOP.SET_PRINT_STYLE("FontSize",12)
			// LODOP.SET_PRINT_PAGESIZE(1,580,intPageHeight,strPageName)
			LODOP.PRINT()


		} 

	}
])



