/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', ['$scope','$alert','$window','orderData','domainData',
  	function($scope,$alert,$window,orderData,domainData) {

		$window.document.title = "结账"; 
		// 获取本地存储已点的菜品
		$scope.cookCart = JSON.parse(localStorage.cook)
		
		$scope.memberAll = [
			{
				name:'徐奥林',
				card:'01232',
				phone:'18694039343',
				time:1492837482382

			},
			{
				name:'杨军',
				card:'01232',
				phone:'18608164404',
				time:1492837482382

			},
			{
				name:'刘洋',
				card:'01232',
				phone:'18694033083',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01232',
				phone:'18694039183',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01232',
				phone:'18691239283',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01232',
				phone:'1869445683',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01232',
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

		// 生成订单
		$scope.order = {}

		//获取店铺信息	
		domainData.getData().then(function(data){
			$scope.shopinfo = data.domain
				$scope.order = {
				name: $scope.shopinfo.name,
				address: $scope.shopinfo.address,
				tel: $scope.shopinfo.tel,
				orderNum: "B342301610010001",
				orderStatus:  0,
				peopleNum: localStorage.peopleNumber,
				dish: $scope.cookCart,
				payType: "$scope.shopinfo.payType",
				payStatus: 1,
				total: $scope.total,
				reduce: $scope.total - $scope.totalReal,
				reduceAfter: $scope.totalReal,
				realToal: $scope.totalReal,
				isMember: false
			}
		})

		// 结算
		$scope.billing = function(){
			orderData.addData($scope.order).then(function(data){

				if(data.status == 1){
					$scope.changeAlert(data.msg)
					printFunc()
					localStorage.removeItem('cook')
					localStorage.removeItem('cookAll')
					localStorage.removeItem('peopleNumber')
					window.location.href="#/index"
				}else{
					 $scope.changeAlert(data.msg)
				}
			})
			
		}
		// 打印函数
		function printFunc(){
			var LODOP=getLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'))
			var ele = document.getElementById('print'),
				content = document.getElementById('print-content')

			// content.appendChild(ele)
			// window.print()
			// content.innerHTML = ""

			LODOP.ADD_PRINT_HTM(10,10,220,ele.offsetHeight,ele.innerHTML)
			LODOP.SET_PRINT_STYLE("FontSize",12)
			// LODOP.SET_PRINT_PAGESIZE(1,580,intPageHeight,strPageName)
			LODOP.PRINT()


		} 
		// 搜索会员用户
		$scope.search = ""
		$scope.member = $scope.memberAll
		$scope.searchMember = function(value){
			console.log(value)
			$scope.member = $scope.memberAll.filter(function(ele){
				if(ele.phone.indexOf(value)>=0){
					return ele
				}
			})
		}

	}
])









