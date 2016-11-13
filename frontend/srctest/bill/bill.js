/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', ['$scope','$alert','$window','$interval','orderData','memberData','memberorderData','domainData','paytypeData','creditData','dayData','itemData','pospayData',
  	function($scope,$alert,$window,$interval,orderData,memberData,memberorderData,domainData,paytypeData,creditData,dayData,itemData,pospayData) {

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
		
		//会员信息
		$scope.memberAll = []
		memberData.getData().then(function(data){

			$scope.memberAll = data.members
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
		})


		$scope.total = 0
		$scope.totalReal = 0

		// 总价格，实际价格
		$scope.cookCart.forEach(function(ele){
			$scope.total += ele.number*ele.price
			ele.payType = 0
			// ele.memberPrice = 0
		})

		// 折后、减免、免单后的真实价格
		$scope.totalReal = angular.copy($scope.total)

		// 打折
		$scope.discountFunc = function(value){
			$scope.totalReal = 0
			$scope.cookCart.forEach(function(ele){
				ele.reducePrice = ele.price*value*0.01
				$scope.totalReal += ele.reducePrice
				ele.reduceNum = value
			})

			refresh()

		}
		
		// 打折 - 单品
		$scope.discountItemFunc = function(value,discount){
			value.reducePrice = value.price*discount*0.01
			value.reduceNum = discount
			refresh()

		}

		// 减价
		$scope.reduceFunc = function(value){
			cashFunc(value)
		}

		// 免单
		$scope.freeFunc = function(value){
			$scope.totalReal = 0
			refresh()
		}

		//抹零
		$scope.roundFunc = function(value){
			var old = value.realTotal
			$scope.order.realTotal = Math.round(old)
			$scope.order.erase = Math.round((old - $scope.order.realTotal)*100)/100
			alert($scope.order.erase)
		}

		// 更新价格
		function refresh(){

			$scope.order.realTotal = 0
			$scope.cookCart.forEach(function(ele){
				$scope.order.realTotal += ele.number*ele.reducePrice
			})

			$scope.order.reduce = $scope.total - $scope.order.realTotal
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
		$scope.payTypeArr = []
		$scope.creditArr = []
		$scope.discountDfault = [95,90,85,80,75,70]
		$scope.payType = []

		//获取支付方式
		paytypeData.getData().then(function(data){
			$scope.payTypeArr = data.paytypes.map(function(value){
				return value.label
			})
		})

		// 获取挂帐人员
		creditData.getData().then(function(data){

			$scope.creditArr = data.credits.map(function(value){
				return value.label
			})
		})

		// 挂帐
		$scope.selectCredit = function(index){
			$scope.discountFunc(0)
			$scope.order.noincome = $scope.order.reduce		//计入虚收
			$scope.order.redit = index	// 纪录编号

		}

		// 选择付款方式 统一
		$scope.selectType = function(value){
			$scope.wechatHide = false
			$scope.auth_code = ""
			$scope.alipay_auth_code = ""
			$scope.cookCart.forEach(function(ele,index){
				ele.payType = value
				if(value == 4){		//等于4计入次卡，一定要注意顺序！
					$scope.discountItemFunc(ele,0)
					$scope.order.onceincome = $scope.order.reduce		//计入次卡消费

				}
				// else if(value == 0){
				// 	$scope.order.cashincome = $scope.order.totalReal	// 计入现金收入

				// }
				// else{
				// 	$scope.discountItemFunc(ele,100)
				// }
				
			})
			payTypeFunc()
			if(value == 1){
				//禁止手动结账
				$scope.wechatHide = true
				//聚焦使用扫码枪
				document.getElementById("wechat").focus()
			}
			if(value == 2){
				$scope.wechatHide = true
				document.getElementById("alipay").focus()
			}
		}

		// 选择付款方式 单项
		$scope.selectPay = function(ele,index) {
			ele.payType = index
			if(index == 4){
				$scope.discountItemFunc(ele,0)
				$scope.order.onceincome = $scope.order.reduce		//计入次卡消费

			}
			// else if(value == 0){
			// 	$scope.order.cashincome = $scope.order.totalReal	// 计入现金收入

			// }
			else{
				$scope.discountItemFunc(ele,100)
			}
			payTypeFunc()
			
		}

		// 选择会员
		$scope.selectMember = function(value){
			$scope.discountFunc(100 - value.discount)
			selectMemberFunc(true,value.username,value.code,value.phone,$scope.order.realTotal)
		}

		// 选择会员更新数据函数
		function selectMemberFunc(isMember,name,num,phone,realtotal){
			$scope.order.isMember = isMember
			$scope.order.memberName = name
			$scope.order.memberNum = num
			$scope.order.memberPhone = phone.substr(0, 3) + '****' + phone.substr(7, 11)
			$scope.order.realTotal = realtotal
	
		}


		// 付款方式选择函数
		function payTypeFunc(){
			$scope.order.payType = []
			$scope.cookCart.forEach(function(value,index){
				if($scope.order.payType.indexOf(value.payType)<0 ){
					$scope.order.payType.push(value.payType)
				}
			})
		}
		payTypeFunc()

		// 订单号  门店编号 年 月 日 时 分 秒  2016 10 11 + 0001
		
		// 设置流水号
		function setSerial(){
			
			var dayid = localStorage.dayid
			dayData.getIdData(dayid).then(function(data){
				var serial = data.day.serial+""
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
					
				}
				localStorage.serialNum = serialNum
			})
			
			
		}
		setSerial()

		//存入本地店id
		domainData.getShopidData().then(function(data){
			var shopid = data.shopid 
			localStorage.shopid = shopid
		})

		//存入本地当前订单号
		domainData.getData().then(function(data){
			var shopinfo = data.domain,
				serialNum = localStorage.serialNum,
				orderNum = shopinfo.name +Y + M + D + serialNum
				localStorage.orderNum = orderNum
		})

		//获取店铺信息	初始化order
		function getShopInfo(){
			domainData.getData().then(function(data){
				var shopinfo = data.domain,
					serialNum = localStorage.serialNum,
					orderNum = shopinfo.name +Y + M + D + serialNum

				$scope.order = {
					"isTop":false,
	            	"isChecked":false,
					"name": shopinfo.name,
					"address": shopinfo.address,
					"tel": shopinfo.tel,
					"orderNum": orderNum,
					"peopleNum": localStorage.peopleNumber,
					"dish": $scope.cookCart,
					"payStatus": 1,
					"noincome": 0,
					"credit":0,
					"erase":0,
					"onceincome":0,
					"cashincome":0,
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

		// 找零
		$scope.cashInfo = [10,15,20,30,50,100]

		$scope.selectCash = function(value){
			$scope.cashTotal = value - $scope.order.realTotal
		}

		// 结算
		$scope.billing = function(value){
			$scope.nowtime = new Date().getTime()
			$scope.order.dishNum = angular.copy(value)	//取餐号
			console.log($scope.order.dish)
			$scope.order.dish.forEach(function(ele){
				var item = {
					isTop:false,
	            	isChecked:false,
					name: ele.name,
					cate: ele.cate,
					price:ele.price,
					reducePrice:ele.reducePrice,
					number:ele.number, 
					total:ele.number * ele.price,
					time:Date.now(),
					year: Y,
					month: M,
					day: D,
					orderNum:localStorage.orderNum

				}

				// 品项
				itemData.addData(item).then(function(data){
					
				})
			})

			orderData.addData($scope.order).then(function(data){

				if(data.status == 1){
					$scope.changeAlert("点餐成功！")

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

				  		})
					})

					// 更新数据库的流水号 ，以及清除一些订单信息	
					localStorage.removeItem('cook')
					localStorage.removeItem('cookAll')
					localStorage.removeItem('peopleNumber')
					localStorage.removeItem('member')
					localStorage.removeItem('memberDiscount')
					localStorage.removeItem('memberCash')

					window.location.href="#/index"
				}else{
					$scope.changeAlert(data.msg)
				}
			})
	
		}

		// 会员卡微信支付
		$scope.wechatTag = false
		$scope.wechatPay = function(){
			$scope.wechatTag = true
			// 取得shopid
			domainData.getShopidData().then(function(data){
				var shopid = data.shopid

				if(localStorage.member != null ){
					var member = JSON.parse(localStorage.member)
					var dis = 100 - parseInt(member.discount)
					$scope.discountFunc(dis)
					selectMemberFunc(true,member.username,member.code,member.phone,member.fee/100)

				}else{
					//连续向服务器发请求
					$scope.stop = $interval(function(){
						// 如何去判断是谁提交了订单付款请求 
						memberorderData.getInfo(shopid).then(function(data){
							if(data.status == 1){
								if(localStorage.localcash == null){
									localStorage.localcash = 0
								}
								var dis = 100 - parseInt(data.member.discount)
								$scope.discountFunc(dis)
								selectMemberFunc(true,data.member.username,data.member.code,data.member.phone,data.member.fee/100)
								
								if($scope.reduceAfter - data.member.fee/100 - localStorage.localcash/100 ==0){
									$interval.cancel($scope.stop)
									$scope.wechatTag = false
									$scope.changeAlert("付款成功！")
									localStorage.member = JSON.stringify(data.member)
									localStorage.removeItem('localcash')
								}else{
									var now = localStorage.getItem('localcash')
									localStorage.setItem('localcash',parseInt(data.member.fee)+parseInt(now))
									$scope.order.realTotal = localStorage.localcash/100

									$scope.changeAlert("付款金额不正确！")

									$scope.changeAlert("付款金额不正确！" )

									
								}

							}
						})
					},500)

				}
								

			})

		}

		// 优惠券微信支付
		$scope.wechatTag = false
		$scope.wechatDiscountPay = function(){
			$scope.wechatTag = true
			// 取得shopid
			domainData.getShopidData().then(function(data){
				var shopid = data.shopid

				if(localStorage.memberDiscount != null ){
					var member = JSON.parse(localStorage.memberDiscount)
					var dis = 100 - parseInt(member.discount)
					$scope.discountFunc(dis)
					$scope.order.realTotal = member.fee/100

				}else{
					//连续向服务器发请求
					$scope.stop = $interval(function(){
						// 如何去判断是谁提交了订单付款请求 
						memberorderData.getInfo(shopid).then(function(data){
							if(data.status == 1){
								$scope.wechatTag = false
								$interval.cancel($scope.stop)
								var dis = 100 - parseInt(data.member.discount)
								$scope.discountFunc(dis)
								$scope.order.realTotal = data.member.fee/100
								
								$scope.changeAlert("付款成功！")
								localStorage.memberDiscount = JSON.stringify(data.member)
							}
						})
					},500)

				}
								
			})
		}

		//微信代金券支付
		$scope.wechatCashPay = function(){
			$scope.wechatTag = true
			// 取得shopid
			domainData.getShopidData().then(function(data){
				var shopid = data.shopid

				if(localStorage.memberCash != null ){
					var member = JSON.parse(localStorage.memberCash)
					var dis = parseInt(member.discount/100)
					cashFunc(dis)
					$scope.order.realTotal = member.fee/100

				}else{
					//连续向服务器发请求
					$scope.stop = $interval(function(){
						// 如何去判断是谁提交了订单付款请求 
						memberorderData.getInfo(shopid).then(function(data){
							if(data.status == 1){
								$scope.wechatTag = false
								$interval.cancel($scope.stop)
								var dis = parseInt(data.member.discount/100)
								cashFunc(dis)
								$scope.order.realTotal = data.member.fee/100
								
								$scope.changeAlert("付款成功！")
								localStorage.memberCash = JSON.stringify(data.member)
							}
						})
					},500)

				}
								
			})
		}


		$scope.wechatPayCancel = function(){
			$scope.wechatTag=false
			$interval.cancel($scope.stop)

		}

		
		//微信刷卡支付
		$scope.wechatPosPay =function(code){

			var value = {
				total_fee:$scope.order.realTotal,
				auth_code:code,
				device_info:localStorage.shopid,
				out_trade_no:localStorage.orderNum
			}

			pospayData.setData(value).then(function(data){
				$scope.changeAlert(data.msg)
				if(data.status === 1){
					$scope.wechatHide = false
					//模拟点击，还是采用了dom的方式
					document.getElementById('bill').click()
				}else if(data.status === 2){ //需要输入密码，这时去查询订单的状态
					var interval = setInterval(function(){
						pospayData.orderData(value).then(function(orderdata){
							$scope.changeAlert(orderdata.msg)
							if(orderdata.status === 1){
								clearInterval(interval)
								$scope.wechatHide = false
								document.getElementById('bill').click()
							}
						})
					},5000)
				}
			})
		}

		//支付宝刷卡支付
		$scope.alipayPosPay =function(code){

			var value = {
				total_fee:$scope.order.realTotal,
				auth_code:code,
				device_info:localStorage.shopid,
				out_trade_no:localStorage.orderNum
				
			}

			pospayData.setalipayData(value).then(function(data){
				$scope.changeAlert(data.msg)
				if(data.status === 1){
					$scope.wechatHide = false
					document.getElementById('bill').click()
				}
			})
		}

		// 按比例减免
		function cashFunc(value){
			$scope.totalReal = 0
			$scope.cookCart.forEach(function(ele){
				ele.reducePrice = ele.price - value/$scope.cookCart.length
				$scope.totalReal += ele.reducePrice

			})
			if($scope.totalReal<=0){
				$scope.totalReal = 0
			}
			refresh()

		}

		// 打印函数
		function printFunc(){
			
			var ele = document.getElementById('print')
			var content = document.getElementById('print-content')

			//打印
			content.innerHTML = ""
			content.appendChild(ele)
			window.print() 
			content.innerHTML = ""

		} 

	}
])









