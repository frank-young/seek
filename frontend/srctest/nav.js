/********************************************************************************************************************
 *                                                     导航条
 ********************************************************************************************************************/

angular.module("navMoudle", []).controller('NavCtrl', ['$scope','$rootScope','$interval','dayData','orderData','itemData','overData',
  	function($scope,$rootScope,$interval,dayData,orderData,itemData,overData) {
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
					// payType:Array, 
					// time:Number, 
					year:data.year,
					month:data.month,
					day:data.day,
					// memberNum:Number,
					start:data.start,
					stop:date.now
				}

			})

		}

		$scope.todayData={
	  		items:[],
	  		overAll:[],
	  		overs:[]
	  	}

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

	  	$scope.printOver = function(){
	  		printFunc('print-over')
	  	}

		$scope.printItem = function(){
			printFunc('print-item')
		}

		//确认交班
		$scope.exchangeSure = function(){
			overData.addData($scope.gradeData).then(function(data){
				console.log(data)
			})
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
  				console.log(data.msg)
  				localStorage.dayid = data.id
  			})

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
	  		// console.log($scope.time)

	  		var dateObj = {
	  			"_id":localStorage.dayid,
  				"stop": date.now,
  				"status":0
  			}

	  		dayData.updateData(dateObj).then(function(data){
	  			console.log(data.msg)
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
			var LODOP=getLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'))
			var ele = document.getElementById(id)

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

















  