/********************************************************************************************************************
 *                                                     导航条
 ********************************************************************************************************************/

angular.module("navMoudle", []).controller('NavCtrl', ['$scope','$rootScope','$interval','dayData','orderData','itemData','overData','domainData','memberorderData','payorderData',
  	function($scope,$rootScope,$interval,dayData,orderData,itemData,overData,domainData,memberorderData,payorderData) {
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
  		
  		
  		// 业绩查询-交班
		$scope.exchangeFunc = function(){
			
			var date = createTime()
			orderData.getGradeData().then(function(data){
				$scope.gradeData = {
					totalReal:data.grade,  	// 实收
					editPeople:data.username,
					noincome:data.noincome,		// 虚收
					people:data.people,	//用餐人数
					stand:data.stand,	//用餐台数
					reduce:data.reduce,	//优惠金额
					onceincome:data.onceincome,	//次卡
					total:data.total,	// 合计--总合计
					totalNeed:data.totalNeed,	// 应收
					reduceAfter:data.reduceAfter,
					erase:data.erase,
					// payType:Array, 
					// time:Number, 
					year:data.year,
					month:data.month,
					day:data.day,
					// memberNum:Number,
					start:data.start,
					stop:date.now
				}
				// 备用金查询
				domainData.getData().then(function(d){
		  			$scope.gradeData.cash = d.domain.cash
		  		})
			})
		}

		$scope.todayData={
	  		items:[],
	  		overAll:[],
	  		overs:[],
	  		wxpay:0,
	  		wxpospay:0,
	  		alipospay:0
	  	}
	  	//获取所有的结班信息
	  	function getAllInfo(){
	  		// 获取品项报告
		  	itemData.getTodayData().then(function(data){
	  			$scope.todayData.items = data.items
	  		})

		  	// 获取结班报告
	  		orderData.getGradeAllData().then(function(data){
	  			$scope.todayData.overAll = data	
	  		})

	  		// 获取所有人的结班报告
	  		overData.getTodayData().then(function(data){
	  			$scope.todayData.overs = data.overs	
	  		})

	  		// 获取会员微信支付金额
	  		domainData.getShopidData().then(function(data){
	  			memberorderData.getWxpay(data.shopid).then(function(wxdata){
	  				$scope.todayData.wxpay = wxdata.wxpay
	  			})

	  		})

	  		//获取微信支付金额
	  		domainData.getShopidData().then(function(data){
	  			payorderData.getData(data.shopid).then(function(wxdata){
		  			$scope.todayData.wxpospay = wxdata.wxpospay
		  		})
	  		})

	  		//获取支付宝支付金额
	  		domainData.getShopidData().then(function(data){
	  			payorderData.getAlipayData(data.shopid).then(function(alipaydata){
		  			$scope.todayData.alipospay = alipaydata.alipospay
		  		})
	  		})
	  	}
	  	getAllInfo()

	  	$scope.printOver = function(){
	  		printFunc('print-over')
	  	}

		$scope.printItem = function(){
			printFunc('print-item')
		}

		//确认交班
		$scope.exchangeSure = function(){
			
			overData.addData($scope.gradeData).then(function(data){
				
			})
		}
		//打印个人订单
		$scope.printSelf = function(){
			printFunc('print-self')
		}

	  	// 开班
	  	$scope.startDay = function(){
  			$rootScope.status = false
	
	  		var date = createTime()

	  		$scope.time = date.now 		// 开班时间

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
			$scope.nowtime = new Date().getTime()
	  	
	  	// 结班按钮
		$scope.stopDayButton = function(){
			getAllInfo()
		}
	  	// 结班
	  	$scope.stopDay = function(){

	  		// 本班信息
	  		$rootScope.status = true
	  		localStorage.removeItem('starDay')
	  		localStorage.removeItem('cook')
			localStorage.removeItem('cookAll')
			localStorage.removeItem('peopleNumber')
			localStorage.removeItem('serial')
 
			var date = createTime()
	  		$scope.time = date.now	// 结班时间

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

	  	// 打印函数
		function printFunc(id){
			var ele = document.getElementById(id)
			var content = document.getElementById('print-content')
			
			var newObj=ele.cloneNode(true)
			$scope.nowtime = new Date().getTime()
			content.innerHTML = ""

			content.appendChild(newObj)
			window.print()
			content.innerHTML = ""

		} 

	}
])

















  