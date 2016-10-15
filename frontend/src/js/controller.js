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









;/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("billlistMoudle", []).controller('BilllistCtrl', ['$scope','$window','orderData','dishData',
  	function($scope,$window,orderData,dishData) {

		$window.document.title = "订单列表"; 
		orderData.getData().then(function(data){
			$scope.orders = data.orders
		})
		$scope.payTypeArr = ['现金','微信','支付宝','会员卡','次卡']

		$scope.cookAll = []
		dishData.getData().then(function(data){
			$scope.cookAll = data.dishs
		})

		$scope.lookAll = function(id){
			orderData.getIdData(id).then(function(data){
				$scope.order = data.order
			})

		}
		
		// 反位结算，删除本单，重新下单
		$scope.againAccount = function(value){

			localStorage.cook = JSON.stringify(value.dish)
			localStorage.peopleNum = value.peopleNum
			value.dish.forEach(function(v1,i1){
				$scope.cookAll.forEach(function(v2,i2){
					if(v1.name == v2.name){
						v2.checked = true
					}
				})
			})
			localStorage.cookAll = JSON.stringify($scope.cookAll)
			orderData.deleteData(value._id).then(function(data){
				console.log(data)
			})
		}

		
	}
])



;/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', ['$scope','$rootScope','$window','$location',
  	function($scope,$rootScope,$window,$location) {

		$window.document.title = "seek cafe"

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



;/********************************************************************************************************************
 *                                                     会员信息
 ********************************************************************************************************************/

angular.module("memberMoudle", []).controller('MemberCtrl', ['$scope','$rootScope','$window',
  	function($scope,$rootScope,$window) {

		$window.document.title = "会员信息"
		$scope.memberAll = [
			{
				name:'徐奥林',
				card:'01213',
				phone:'18694039343',
				time:1492837482382

			},
			{
				name:'杨军',
				card:'01213',
				phone:'18608164404',
				time:1492837482382

			},
			{
				name:'刘洋',
				card:'01213',
				phone:'18694033083',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'18694039183',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'18691239283',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'1869445683',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'1869384283',
				time:1492837482382

			}

		]
		// 搜索会员用户
		$scope.search = ""
		$scope.member = $scope.memberAll
		$scope.searchMember = function(value){
			$scope.member = $scope.memberAll.filter(function(ele){
				if(ele.phone.indexOf(value)>=0){
					return ele
				}
			})
		}

		// 添加会员
		$scope.addMember = function(){
			// 直接向服务器发送信息，需要考虑微信会员的那块
		}

	}
])









;/********************************************************************************************************************
 *                                                     导航条
 ********************************************************************************************************************/

angular.module("navMoudle", []).controller('NavCtrl', ['$scope','$rootScope','$interval','dayData',
  	function($scope,$rootScope,$interval,dayData) {
  		// 设置时间
	  	function setTime(){
	  		return $scope.time = new Date()
	  	}
	  	$interval(function() {
	  		setTime()
	  	}, 1000)
	  	setTime()

	  	// 本地存储开班、结班
	  	if(localStorage.starDay != null){
  			$rootScope.status = false;
  		}else{
  			$rootScope.status = true;
  		}

	  	// 开班
	  	$scope.startDay = function(){
  			$rootScope.status = false
	
	  		var date = createTime()

	  		$scope.time = date.now 		// 开班时间
  			// console.log($scope.time)
  			localStorage.starDay = 1
  			localStorage.serial = 1

  			var dateObj = {
  				"date":date.today,
  				"year":date.y,
  				"month":date.m,
  				"day":date.d,
  				"start": date.now,
  				"status":1,
  				"serial":1
  			}

  			dayData.addData(dateObj).then(function(data){

  				localStorage.dayid = data.id
  			})


	  	}
	  	// 结班
	  	$scope.stopDay = function(){
	  		$rootScope.status = true
	  		localStorage.removeItem('starDay')
	  		localStorage.removeItem('cook')
			localStorage.removeItem('cookAll')
			localStorage.removeItem('peopleNumber')
			localStorage.removeItem('serial')
			localStorage.removeItem('dayid')

			var date = createTime()
	  		$scope.time = date.now	// 结班时间
	  		// console.log($scope.time)

	  		var dateObj = {
	  			"_id":localStorage.dayid,
  				"stop": date.now,
  				"status":0
  			}
	  		dayData.updateData(dateObj).then(function(data){

	  			localStorage.removeItem('dayid')
	  		})

	  		window.location.href="#/index"
	  	}

	  	// 生成时间，日期等
	  	function createTime(){
	  		var date = new Date(),
				Y = date.getFullYear(),	
		        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
		        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()),
		        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()),
		        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()),
		        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()),
		        now = date.getTime(),
				today = Y + "" + M + "" + D
			return {
				today:today,
				y:Y,
				m:M,
				d:D,
				now:now
			}
	  	}

	}
])



  ;/********************************************************************************************************************
 *                                                     点餐页面
 ********************************************************************************************************************/

angular.module("selectMoudle", []).controller('SelectCtrl', ['$scope','$window','cateData','dishData',
	function($scope,$window,cateData,dishData) {

		$window.document.title = "点餐"
		
		if(localStorage.localCate !=null){
			$scope.localCate = JSON.parse(localStorage.localCate)
		}else{
			$scope.cate = []
			cateData.getData().then(function(data){
				$scope.cate = data.cates
				$scope.cate[0].checked = true
			})
		}

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








