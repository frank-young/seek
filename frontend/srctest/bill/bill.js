/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', ['$scope','$alert','$window','orderData','domainData','dayData','itemData',
  	function($scope,$alert,$window,orderData,domainData,dayData,itemData) {

		$window.document.title = "结账" 
		//时间日期
		var date = new Date(),
			Y = date.getFullYear(),	
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()),
	        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()),
	        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()),
	        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds())

		// 获取本地存储已点的菜品
		$scope.cookCart = JSON.parse(localStorage.cook)
		
		$scope.memberAll = [
			{
				memberName:'徐奥林',
				memberNum:'01232',
				memberPhone:'18694039343',
			},
			{
				memberName:'杨军',
				memberNum:'01233',
				memberPhone:'18608164404',
			}
		]

		$scope.total = 0
		$scope.totalReal = 0

		// 总价格，实际价格
		$scope.cookCart.forEach(function(ele){
			$scope.total += ele.number*ele.price
			ele.payType = 0
			ele.memberPrice = 0
		})

		// 折后、减免、免单后的真实价格
		$scope.totalReal = angular.copy($scope.total)

		// 打折
		$scope.discountFunc = function(value){
			$scope.totalReal = $scope.total*value*0.01
			refresh()
		}
		
		// 打折 - 单品
		$scope.discountItemFunc = function(value,discount){
			value.price = value.price*discount*0.01
			refreshItem($scope.order.dish)

		}

		// 减价
		$scope.reduceFunc = function(value){
			$scope.totalReal = $scope.total - value
			refresh()
		}

		// 免单
		$scope.freeFunc = function(value){
			$scope.totalReal = 0
			refresh()
		}

		//取消减免
		$scope.noReduceFunc = function(value){
			value.realTotal = value.total
			value.reduce = value.total - value.realTotal
			reset()
		}

		//抹零
		$scope.roundFunc = function(value){
			value.realTotal = Math.floor(value.realTotal)
			// value.reduce = value.total - value.realTotal
		}

		// 更新价格
		function refresh(){
			$scope.order.realTotal = $scope.totalReal
			$scope.order.reduce = $scope.total - $scope.totalReal
			$scope.order.reduceAfter = $scope.totalReal
		}

		// 更新单价
		function refreshItem(value){
			$scope.order.realTotal = 0
			
			value.forEach(function(ele){
				$scope.order.realTotal += ele.number*ele.price
			})

			$scope.order.reduce = $scope.totalReal - $scope.order.realTotal
			$scope.order.reduceAfter = $scope.order.realTotal
			
		}

		//恢复原价
		function reset(){
			$scope.order.dish.forEach(function(ele,index){
				ele.price = cookCart[index].price
			})
		}

		// 生成订单
		$scope.order = {}
		$scope.payTypeArr = ['现金','微信','支付宝','会员卡','次卡']
		$scope.discountDfault = [95,90,85,80,75,70]
		$scope.payType = 0

		// 选择付款方式 统一
		$scope.selectType = function(value){
			$scope.order.payType = value
			$scope.cookCart.forEach(function(ele,index){
				ele.payType = value
			})
		}

		// 选择付款方式 单项
		$scope.selectPay = function(ele,index) {
			ele.payType = index
		}

		// 选择会员
		$scope.selectMember = function(value){
			$scope.order.isMember = true
			$scope.order.memberName = value.memberName
			$scope.order.memberNum = value.memberNum
			$scope.order.memberPhone = value.memberPhone.substr(0, 3) + '****' + value.memberPhone.substr(7, 11)
		}

		// 订单号  门店编号 年 月 日 时 分 秒  2016 10 11 + 0001
		
		// 设置流水号
		function setSerial(){
			
			var dayid = localStorage.dayid
			dayData.getIdData(dayid).then(function(data){
				localStorage.serial = data.day.serial
			})

			var serial = localStorage.serial

			var serialNum = ""
			if(serial != null) {
				switch(serial.length){
					case 1:
						serialNum = '00'+serial
						break
					case 2:
						serialNum = '0'+serial
					  	break
					case 3:
						serialNum = serial
					  	break
					default:
						serialNum = serial
						break
				}
				return serialNum
			}
		}
		setSerial()
		//获取店铺信息	
		function getShopInfo(){
			domainData.getData().then(function(data){
				var shopinfo = data.domain,
					serialNum = setSerial(),
					orderNum = shopinfo.name +Y + M + D + serialNum

				$scope.order = {
					"isTop":false,
	            	"isChecked":false,
					"name": shopinfo.name,
					"address": shopinfo.address,
					"tel": shopinfo.tel,
					"orderNum": orderNum,
					// "orderStatus":  0,
					"peopleNum": localStorage.peopleNumber,
					"dish": $scope.cookCart,
					"payType": $scope.payType,
					"payStatus": 1,
					"total": $scope.total,
					"reduce": $scope.total - $scope.totalReal,
					"reduceAfter": $scope.totalReal,
					"realTotal": $scope.totalReal,
					"isMember": false,
					"time":Date.now(),
					"year": Y,
					"month": M,
					"day": D,
				}

			})
		}

		getShopInfo()

		// 结算
		$scope.billing = function(){

			$scope.order.dish.forEach(function(ele){
				var item = {
					"isTop":false,
	            	"isChecked":false,
					"name": ele.name,
					"cate": ele.cate,
					"price":ele.price,
					number:ele.number, 
					total:ele.number * ele.price,
					// comboPrice: ele.comboPrice,
					"time":Date.now(),
					"year": Y,
					"month": M,
					"day": D,
					other:""
				}

				itemData.addData(item).then(function(data){
	
				})
			})

			orderData.addData($scope.order).then(function(data){

				if(data.status == 1){
					$scope.changeAlert(data.msg)
					printFunc()

					var dayid = localStorage.dayid
					dayData.getIdData(dayid).then(function(data){
						serial = data.day.serial
						localStorage.serial = serial+1
						var dateObj = {
				  			"_id": dayid,
			  				"serial": serial+1
			  			}
			  			dayData.updateData(dateObj).then(function(data){
				  			// console.log(data)
				  		})
					})
					// var serial = parseInt(localStorage.serial)
					// localStorage.serial = serial+1
					// 更新数据库的流水号 	

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
				if(ele.memberPhone.indexOf(value)>=0){
					return ele
				}
			})
		}

	}
])









