/********************************************************************************************************************
 *                                                     结账页面
 ********************************************************************************************************************/

angular.module("billMoudle", []).controller('BillCtrl', ['$scope','$alert','$window','$interval','orderData','memberData','memberorderData','domainData','paytypeData','creditData','dayData','itemData','pospayData','settingData','petcardData',
  	function($scope,$alert,$window,$interval,orderData,memberData,memberorderData,domainData,paytypeData,creditData,dayData,itemData,pospayData,settingData,petcardData) {

		//时间日期
		var date = new Date(),
			Y = date.getFullYear(),	
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()),
	        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()),
	        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()),
	        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds())
	    // 权限控制
		settingData.getRbac().then(function(data){
			$scope.role = data.rbac
		})

		// 获取本地存储已点的菜品
		$scope.cookCart = JSON.parse(localStorage.cook)
		
		//会员信息
		$scope.memberAll = []
		petcardData.getData().then(function(data){

			$scope.memberAll = data.petcards
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
		// $scope.changeAlert("点击“返回”按钮重新选择菜品")

		$scope.total = 0
		$scope.totalReal = 0
		$scope.panels = -1

		// 总价格，实际价格
		$scope.cookCart.forEach(function(ele){
			$scope.total += ele.number*ele.price
			ele.payType = 0
			// ele.memberPrice = 0
		})

		// 折后、减免、免单后的真实价格
		$scope.totalReal = angular.copy($scope.total)
		$scope.discount = 100
		// 打折
		$scope.discountFunc = function(value){
			$scope.totalReal = 0
			$scope.cookCart.forEach(function(ele){
				ele.reducePrice = ele.price*value*0.01
				$scope.totalReal += ele.reducePrice
				ele.reduceNum = value
			})

			refresh()
			$scope.changeAlert("请选择付款方式！")
			$scope.wechatHide = true
			$scope.outwrap = false
		}
		
		// 打折 - 单品
		$scope.discountItemFunc = function(value,discount){
			value.reducePrice = value.price*discount*0.01
			value.reduceNum = discount
			refresh()

		}

		// 减价
		$scope.reduce = 0
		$scope.reduceFunc = function(value){
			$scope.changeAlert("请选择付款方式！")
			$scope.wechatHide = true
			$scope.outwrap = false
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
			$scope.order.realTotal = Math.ceil(old)
			$scope.order.erase = Math.round((old - $scope.order.realTotal)*100)/100
			
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
		$scope.discountDfault = [95,90,85,80]
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
		$scope.selectCredit = function(index,p){
			resetIncome()
			$scope.discountFunc(0)
			$scope.order.noincome = $scope.order.reduce		//计入虚收
			$scope.order.redit = index	// 纪录编号

			$scope.creditShow = true
			$scope.order.creditPeople = p
		}
		$scope.creditShow = false
		$scope.outwrap = false
		$scope.pendingShow = true
		$scope.memberShow = false //会员卡左侧支付方式
		// 选择付款方式 统一
		$scope.selectType = function(value,index){

			resetIncome()
			$scope.wechatHide = false
			$scope.pendingShow = true
			$scope.creditShow = false
			$scope.memberShow = false
			$scope.auth_code = ""
			$scope.alipay_auth_code = ""
			$scope.cookCart.forEach(function(ele,i){
				ele.payType = index
				if(value == "次卡"){
					$scope.discountItemFunc(ele,0)
					$scope.order.onceincome = $scope.order.reduce		//计入次卡消费
					$scope.order.reduce = 0
				}
			})
			payTypeFunc()
			if(value == "现金" || value == "MOD"){
				$scope.outwrap = false
				$scope.panels = -1
				$scope.order.cashincome = $scope.order.realTotal	// 计入现金收入
			}else if(value == "微信"){
				$scope.outwrap = true
				$scope.wxshow = true
				$scope.alipayshow = false
				$scope.petcardshow = false
				$scope.panels = -1
				$scope.changeAlert("已选择微信刷卡支付，请用扫码枪扫码！")
				$scope.order.wxincome = $scope.order.realTotal 		// 计入微信收入
				//禁止手动结账
				$scope.wechatHide = true
				//聚焦使用扫码枪
				document.getElementById("wechat").focus()
			}else if(value == "支付宝"){
				$scope.outwrap = true
				$scope.alipayshow = true
				$scope.wxshow = false
				$scope.petcardshow = false
				$scope.panels = -1
				$scope.changeAlert("已选择支付宝刷卡支付，请用扫码枪扫码！")
				$scope.order.alipayincome = $scope.order.realTotal  // 计入支付宝收入
				$scope.wechatHide = true
				document.getElementById("alipay").focus()
			}else if(value == "校园卡"){
				$scope.outwrap = false
				$scope.panels = -1
				$scope.order.schoolincome = $scope.order.realTotal  // 计入校园卡收入
			}else if(value == "会员卡" || value == "会"){
				$scope.memberShow = true
				$scope.outwrap = false
				$scope.panels = 1
				$scope.changeAlert("请在左侧栏目选择会员卡付款方式！")
				$scope.wechatHide = true
				$scope.order.wxincome = $scope.order.realTotal 		// 计入微信收入
			}else if(value == "优惠券"){
				$scope.outwrap = false
				$scope.panels = 2
				$scope.changeAlert("请在左侧栏目选择优惠券类型！")
				$scope.wechatHide = true
				$scope.order.wxincome = $scope.order.realTotal 		// 计入微信收入
			}else if(value == "次卡"){
				$scope.outwrap = false
				$scope.panels = -1
				$scope.changeAlert("若想重新更换支付方式，请一定点击下面“取消减免”按钮！")
					
			}else if(value == "微信-"||value == "微"){
				$scope.order.wxincome = $scope.order.realTotal
			}else if(value == "支付宝-"||value == "支"){
				$scope.order.alipayincome = $scope.order.realTotal
			}else if(value == "刷卡" || value == "信用卡"){
				$scope.order.cardincome = $scope.order.realTotal
			}else if(value == "挂单"){
				$scope.wechatHide = true
				$scope.pendingShow = false
				$scope.outwrap = false
				$scope.panels = -1
			}else if(value == "挂账" || value == "挂帐"){
				$scope.creditShow = true
			} else{
				$scope.outwrap = false
				$scope.panels = -1
				$scope.order.otherincome = $scope.order.realTotal  // 计入其他收入

			}


		}

		//储值卡扫码支付
		$scope.petcardSelect = function(code){
			resetIncome()
			$scope.pet_code = ""
			$scope.outwrap = true
			$scope.alipayshow = false
			$scope.wxshow = false
			$scope.petcardshow = true
			$scope.panels = -1
			$scope.wechatHide = true
			$scope.changeAlert("请扫描微信会员卡卡号！")
			document.getElementById("petcard").focus()
			$scope.order.petcardincome = $scope.order.realTotal		//计入储值会员卡消费
		}
		
		// 选择付款方式 单项
		$scope.selectPay = function(ele,value,index) {
			// resetIncome()
			ele.payType = index
			if(value == "次卡"){
				$scope.discountItemFunc(ele,0)
				$scope.order.onceincome += ele.price		//计入次卡消费
				if($scope.order.cashincome !==0){
					$scope.order.cashincome = $scope.order.cashincome - ele.price
				}
				if($scope.order.schoolincome !==0){
					$scope.order.schoolincome = $scope.order.schoolincome - ele.price
				}
				if($scope.order.onceincome !==0){
					$scope.order.onceincome = $scope.order.onceincome - ele.price
				}
			}
			// else if(value == "现金"){
			// 	$scope.order.cashincome = ele.reducePrice	// 计入现金收入

			// }else if(value == "校园卡"){
			// 	$scope.order.schoolincome = ele.reducePrice  // 计入校园卡收入

			// }
			payTypeFunc()
			
		}

		//重置付款方式收入金额
		function resetIncome(){
			$scope.order.cashincome = 0
			$scope.order.wxincome = 0
			$scope.order.alipayincome = 0
			$scope.order.onceincome = 0
			$scope.order.schoolincome = 0
			$scope.order.petcardincome = 0
			$scope.order.cardincome = 0
		}

		//单个金额不为零判断
		function notZero(argument) {
			
		}

		// 选择会员
		$scope.selectMember = function(value){
			$scope.changeAlert("请选择其他支付方式，如现金、微信、支付宝等")
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
			$scope.shopid = data.shopid 
		})

		//存入本地当前订单号
		domainData.getData().then(function(data){
			var shopinfo = data.domain,
				serialNum = localStorage.serialNum,
				orderNum = shopinfo.name + Math.round((Math.random()*1000)) +'_' + +Y + M + D + serialNum
				localStorage.orderNum = orderNum
		})

		//获取店铺信息	初始化order
		function getShopInfo(){
			domainData.getData().then(function(data){
				var shopinfo = data.domain,
					serialNum = localStorage.serialNum,
					orderNum = shopinfo.name+ Math.round((Math.random()*1000))+'_' +Y + M + D + serialNum

				$scope.order = {
					"isTop":false,
	            	"isChecked":false,
					"name": shopinfo.name,
					"pname": shopinfo.pname,
					"address": shopinfo.address,
					"tel": shopinfo.tel,
					"orderNum": orderNum,
					"peopleNum": localStorage.peopleNumber,
					"dish": $scope.cookCart,
					"payType":[0],	// 补丁
					"payStatus": 1,
					"noincome": 0,
					"credit":0,
					"erase":0,
					"onceincome":0,
					"cashincome":$scope.totalReal,
					"wxincome":0,
					"alipayincome":0,
					"schoolincome":0,
					"otherincome":0,
					"petcardincome":0,
					"cardincome":0,
					"memberBalance":0,
					"eatType":'大厅',
					"creditPeople":"",
					"total": $scope.total,
					"reduce": $scope.total - $scope.totalReal,
					"reduceAfter": $scope.totalReal,
					"realTotal": $scope.totalReal,
					"isMember": false,
					"isPetcard": false,
					"time":Date.now(),
					"year": Y,
					"month": M,
					"day": D
				}

			})
		}

		getShopInfo()

		// 找零
		if(localStorage.shopid && localStorage.shopid ==='279080129') {
			$scope.cashInfo = [50,100]
		}else{
			$scope.cashInfo = [10,15,20,30,50,100]
		}

		$scope.selectCash = function(value){
			$scope.cashTotal = value - $scope.order.realTotal
		}

		// 结算
		$scope.billing = function(value){

			$scope.nowtime = new Date().getTime()
			$scope.order.dishNum = angular.copy(value)	//取餐号
			$scope.order.dish.forEach(function(ele){
				var item = {
					isTop:false,
	            	isChecked:false,
					name: ele.name,
					cate: ele.cate,
					price:Math.round(ele.price*100)/100,
					reducePrice:Math.round(ele.reducePrice*100)/100,
					number:ele.number, 
					dishArr:ele.dishArr,
					total:Math.round(ele.number * ele.reducePrice*100)/100,
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
					printFunc()
				}else{
					$scope.changeAlert(data.msg)
				}
			})
	
		}

		// 挂单
		$scope.pending = function(value){
			$scope.nowtime = new Date().getTime()
			$scope.order.dishNum = angular.copy(value)	//取餐号
			$scope.order.payStatus = 0
			$scope.order.realTotal = 0
			resetIncome()

			orderData.addData($scope.order).then(function(data){

				if(data.status == 1){
					$scope.changeAlert("挂单成功！")

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
					// printFunc()
				}else{
					$scope.changeAlert(data.msg)
				}
			})
	
		}

		// 会员卡微信支付
		$scope.wechatTag = false
		$scope.gaptag = false
		$scope.consoleCtrl = false
		$scope.wechatPay = function(){
			$scope.wechatTag = true
			$scope.wechatHide = true
			$scope.changeAlert("用户付款成功后，系统将自动结算")
			$scope.consoleCtrl = true

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
						$scope.changeAlert("用户操作中,请稍后...")

						// 如何去判断是谁提交了订单付款请求 
						memberorderData.getInfo(shopid).then(function(data){
							if(data.status == 1){
								if(localStorage.localcash == null){
									localStorage.localcash = 0
								}
								var dis = 100 - parseInt(data.member.discount)
								$scope.discountFunc(dis)
								selectMemberFunc(true,data.member.username,data.member.code,data.member.phone,data.member.fee/100)
								
								if($scope.order.reduceAfter - data.member.fee/100 - localStorage.localcash/100 <=0.1){
									$interval.cancel($scope.stop)
									$scope.wechatTag = false
									$scope.gaptag = false
									$scope.changeAlert("付款成功！")
									localStorage.member = JSON.stringify(data.member)
									localStorage.removeItem('localcash')
									document.getElementById('bill').click()
								}else{
									var now = localStorage.getItem('localcash')
									localStorage.setItem('localcash',parseInt(data.member.fee)+parseInt(now))
									$scope.order.realTotal = localStorage.localcash/100
									$scope.gaptag = true
									$scope.gap = $scope.order.reduceAfter - $scope.order.realTotal
									$scope.changeAlert("付款金额不正确！")
									
								}

							}
						})
					},1000)
					setTimeout(function() {
						$scope.wechatTag = false
						$interval.cancel($scope.stop)
						$scope.changeAlert("付款超时，请重新操作！")
					}, 180000)
				}
								

			})

		}

		// 优惠券微信支付

		$scope.wechatDiscountPay = function(){
			$scope.wechatTag = true
			$scope.wechatHide = true
			$scope.changeAlert("用户付款成功后，系统将自动结算")

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
						$scope.changeAlert("用户操作中,请稍后...")
						// 如何去判断是谁提交了订单付款请求 
						memberorderData.getInfo(shopid).then(function(data){
							if(data.status == 1){
								// $scope.wechatTag = false
								// $interval.cancel($scope.stop)
								var dis = 100 - parseInt(data.member.discount)
								$scope.discountFunc(dis)
								// $scope.order.realTotal = data.member.fee/100
								// $scope.changeAlert("付款成功！")
								// localStorage.memberDiscount = JSON.stringify(data.member)

								if($scope.order.reduceAfter - data.member.fee/100 - localStorage.localyhq/100 <=0){
									$interval.cancel($scope.stop)
									$scope.wechatTag = false
									$scope.gaptag = false
									$scope.changeAlert("付款成功！")
									localStorage.memberDiscount = JSON.stringify(data.member)
									localStorage.removeItem('localyhq')
									document.getElementById('bill').click()
								}else{
									var now = localStorage.getItem('localyhq')
									localStorage.setItem('localyhq',parseInt(data.member.fee)+parseInt(now))
									$scope.order.realTotal = localStorage.localcash/100
									$scope.gaptag = true
									$scope.gap = $scope.order.reduceAfter - $scope.order.realTotal
									$scope.changeAlert("付款金额不正确！")
								}

							}
						})
					},1000)
					setTimeout(function() {
						$scope.wechatTag = false
						$interval.cancel($scope.stop)
						$scope.changeAlert("付款超时，请重新操作！")
					}, 180000)
				}
								
			})
		}

		//微信代金券支付
		$scope.wechatCashPay = function(){
			$scope.wechatTag = true
			$scope.wechatHide = true
			$scope.changeAlert("用户付款成功后，系统将自动结算")

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
						$scope.changeAlert("用户操作中,请稍后...")
						// 如何去判断是谁提交了订单付款请求 
						memberorderData.getInfo(shopid).then(function(data){
							if(data.status == 1){
								// $scope.wechatTag = false
								// $interval.cancel($scope.stop)
								var dis = parseInt(data.member.discount/100)
								cashFunc(dis)
								// $scope.order.realTotal = data.member.fee/100
								// $scope.changeAlert("付款成功！")
								// localStorage.memberCash = JSON.stringify(data.member)

								if($scope.order.reduceAfter - data.member.fee/100 - localStorage.localdjq/100 <=0){
									$interval.cancel($scope.stop)
									$scope.wechatTag = false
									$scope.gaptag = false
									$scope.changeAlert("付款成功！")
									localStorage.memberCash = JSON.stringify(data.member)
									localStorage.removeItem('localdjq')
									document.getElementById('bill').click()
								}else{
									var now = localStorage.getItem('localdjq')
									localStorage.setItem('localdjq',parseInt(data.member.fee)+parseInt(now))
									$scope.order.realTotal = localStorage.localcash/100
									$scope.gaptag = true
									$scope.gap = $scope.order.reduceAfter - $scope.order.realTotal
									$scope.changeAlert("付款金额不正确！")
								}

							}
						})
					},1000)
					setTimeout(function() {
						$scope.wechatTag = false
						$interval.cancel($scope.stop)
						$scope.changeAlert("付款超时，请重新操作！")
					}, 180000)
				}
								
			})
		}

		$scope.wechatPayCancel = function(){
			$scope.wechatTag=false
			// $scope.wechatHide = false
			$scope.changeAlert("已取消操作！")
			$interval.cancel($scope.stop)
			$scope.consoleCtrl = false

		}

		
		//微信刷卡支付
		$scope.wechatPosPay =function(code){
			$scope.order.wxincome = $scope.order.realTotal
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
			$scope.order.alipayincome = $scope.order.realTotal
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
				}else if(data.status === 2){ //需要输入密码，这时去查询订单的状态
					var interval = setInterval(function(){
						pospayData.alipayOrderData(value).then(function(orderdata){
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

		//储值会员刷卡支付
		$scope.petcardPosPay =function(code){
			$scope.order.petcardincome = $scope.order.realTotal
			var value = {
				total_fee:$scope.order.realTotal,
				int:parseInt($scope.order.reduce),
				code:code
			}



			petcardData.reduceData(value).then(function(data){
				$scope.changeAlert(data.msg)
				if(data.status === 1){
					$scope.pet_code = ""
					$scope.wechatHide = false
					selectMemberFunc(true,data.petcard.username,data.petcard.code,data.petcard.phone,$scope.order.realTotal)
					$scope.order.memberBalance = Math.round((data.petcard.balance)*100)/100
					$scope.order.isPetcard = true;
					document.getElementById('bill').click()
					$scope.order.realTotal = 0
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
			if ($scope.shopid == '279080129') {
				content.innerHTML =  '<div class="detail">' + ele.innerHTML + '</div>' + '<hr>' + '<div class="detail">' + ele.innerHTML + '</div>'
			} else {
				content.appendChild(ele)
			}
			window.print() 
			content.innerHTML = ""
		}

		function parseDom(arg) {
		　　 var objE = document.createElement("div")
		　　 objE.innerHTML = arg
		　　 return objE.childNodes

		}
	}
])









;/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("billlistMoudle", []).controller('BilllistCtrl', ['$scope', '$window', 'orderData', 'dishData', 'settingData', 'paytypeData', 'itemData', 'domainData',
    function($scope, $window, orderData, dishData, settingData, paytypeData, itemData, domainData) {

  //       var wxordering = JSON.parse(localStorage.getItem('wxordering'))

		// wxordering.forEach(function(v,i){
		// 	console.log(v.order_num)
		// })

        orderData.getData().then(function(data) {
            $scope.orders = data.orders
        })


        $scope.payTypeArr = []
            //获取支付方式
        paytypeData.getData().then(function(data) {
            $scope.payTypeArr = data.paytypes.map(function(value) {
                return value.label
            })
        })

        $scope.cookAll = []
        dishData.getData().then(function(data) {
                $scope.cookAll = data.dishs
            })
            // 权限控制
        settingData.getRbac().then(function(data) {
            $scope.role = data.rbac
        })

        // 业绩查询
        orderData.getGradeData().then(function(data) {
            $scope.grade = data.grade
            $scope.username = data.username
            $scope.noincome = data.noincome

        })

        $scope.lookAll = function(id) {
            orderData.getIdData(id).then(function(data) {
                $scope.order = data.order
            })
        }

        // 反位结算，删除本单，重新下单
        $scope.againAccount = function(value) {
            localStorage.cook = JSON.stringify(value.dish)
            localStorage.peopleNumber = value.peopleNum
            value.dish.forEach(function(v1, i1) {
                $scope.cookAll.forEach(function(v2, i2) {
                    if (v1.name == v2.name) {
                        v2.checked = true
                        v2.number = 1
                    }
                })
            })
            localStorage.cookAll = JSON.stringify($scope.cookAll)

            orderData.deleteData(value).then(function(data) {
                $scope.changeAlert("反位结算成功！")
            })
            itemData.deletesomeData(value.orderNum).then(function(data) {

            })

        }
        $scope.nowtime = new Date().getTime()
        $scope.printRec = function(value) {
            $scope.nowtime = new Date().getTime()
            printFunc(value)
        }

        domainData.getShopidData().then(function(data) {
            $scope.shopid = data.shopid
        })

        // 打印函数
        function printFunc(id) {
            var ele = document.getElementById(id)
            var content = document.getElementById('print-content')

            var newObj = ele.cloneNode(true)
            content.innerHTML = ""
            content.appendChild(newObj)
            window.print()
            content.innerHTML = ""

        }

    }
])
;/********************************************************************************************************************
 *                                                     未付款订单
 ********************************************************************************************************************/

angular.module("pendingMoudle", []).controller('PendingCtrl', ['$scope','$window','orderData','dishData','settingData','paytypeData','itemData',
  	function($scope,$window,orderData,dishData,settingData,paytypeData,itemData) {
  		$scope.show = false

		orderData.getPendingData().then(function(data){
			$scope.orders = data.orders
		})

		$scope.cookAll = []
		dishData.getData().then(function(data){
			$scope.cookAll = data.dishs
		})

		$scope.lookAll = function(value){
			$scope.show = true
			orderData.getIdData(value._id).then(function(data){
				$scope.order = data.order
			})
		}
  		
		
		// 删除本单，重新下单
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
				$scope.changeAlert("成功！")
			})

			itemData.deletesomeData(value.orderNum).then(function(data){

			})

		}

	}
])



;/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("wxbilllistMoudle", []).controller('WxbilllistCtrl', ['$scope', '$window', 'orderData', 'dishData', 'settingData', 'paytypeData', 'itemData', 'domainData',
    function($scope, $window, orderData, dishData, settingData, paytypeData, itemData, domainData) {

        orderData.getData().then(function(data) {
            $scope.orders = []
            data.orders.forEach(function(order) {
                if (order.wx){
                    $scope.orders.push(order)
                }
            })
        })


        $scope.payTypeArr = []
        //获取支付方式
        paytypeData.getData().then(function(data) {
            $scope.payTypeArr = data.paytypes.map(function(value) {
                return value.label
            })
        })

        $scope.cookAll = []
        dishData.getData().then(function(data) {
                $scope.cookAll = data.dishs
            })
            // 权限控制
        settingData.getRbac().then(function(data) {
            $scope.role = data.rbac
        })

        // 业绩查询
        orderData.getGradeData().then(function(data) {
            $scope.grade = data.grade
            $scope.username = data.username
            $scope.noincome = data.noincome

        })

        $scope.lookAll = function(id) {
            orderData.getIdData(id).then(function(data) {
                $scope.order = data.order
                orderData.updatewxorderData(data.order).then(function(data){
                    if(data.status === 1){
                        orderData.getData().then(function(data) {
                            $scope.orders = []
                            data.orders.forEach(function(order) {
                                if (order.wx){
                                    $scope.orders.push(order)
                                }
                            })
                        })
                    }
                })
            })

        }

        // 反位结算，删除本单，重新下单
        $scope.againAccount = function(value) {
            localStorage.cook = JSON.stringify(value.dish)
            localStorage.peopleNumber = value.peopleNum
            value.dish.forEach(function(v1, i1) {
                $scope.cookAll.forEach(function(v2, i2) {
                    if (v1.name == v2.name) {
                        v2.checked = true
                        v2.number = 1
                    }
                })
            })
            localStorage.cookAll = JSON.stringify($scope.cookAll)

            orderData.deleteData(value).then(function(data) {
                $scope.changeAlert("反位结算成功！")
            })
            itemData.deletesomeData(value.orderNum).then(function(data) {

            })

        }
        $scope.nowtime = new Date().getTime()

        $scope.readDetail = function(id) {
            orderData.getIdData(id).then(function(data) {
                $scope.order = data.order
            })
        }

        $scope.printRec = function(value, id) {
            orderData.getIdData(id).then(function(data) {
                $scope.order = data.order
                $scope.nowtime = new Date().getTime()
                printFunc(value)
            })
        }

        domainData.getShopidData().then(function(data) {
            $scope.shopid = data.shopid
        })

        // 打印函数
        function printFunc(id) {
            var ele = document.getElementById(id)
            var content = document.getElementById('print-content')

            var newObj = ele.cloneNode(true)
            content.innerHTML = ""
            content.appendChild(newObj)
            window.print()
            content.innerHTML = ""

        }

    }
])
;/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', ['$scope', '$rootScope', '$window', '$location', 'settingData', 'domainData', 'tableData',
    function($scope, $rootScope, $window, $location, settingData, domainData, tableData) {

        $window.document.title = "seek cafe点餐系统"
        $scope.wxOrderingShow = false
        $scope.wxOrdering = 0
            // 选择用餐人数
        $scope.people = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        $scope.pNum = 1
        $scope.showNumber = function(value) {
                $scope.pNum = value
            }
            //开始点餐，
        $scope.start = function() {
                //存储用餐人数
                localStorage.peopleNumber = $scope.pNum
                    //删除已有的本地菜品纪录
                localStorage.removeItem('cookAll')
                localStorage.removeItem('cook')
                $window.location.href = "#/select"
            }
            // 权限控制
        settingData.getRbac().then(function(data) {
            $scope.role = data.rbac
        })

        domainData.getShopidData().then(function(data) {
            $scope.shopid = data.shopid
        })
        // 操作了一次 dom
        var audio = document.getElementById("msg-music")

        setInterval(function() {
            tableData.getData('seek').then(function(data) {
                if (data.status === 1) {
                    $scope.wxOrderingShow = true
                    $scope.wxOrdering = data.number
                    $scope.orders = data.orders
                    audio.play()
                }
            })
        }, 5000)

        $scope.clear = function() {
            $scope.wxOrderingShow = false
            $scope.wxOrdering = 0

            if($scope.orders){	// 清除标记
            	localStorage.setItem('wxordering',JSON.stringify($scope.orders))
            	$scope.orders.forEach(function(v, i) {
	            	tableData.updateData(v._id)
	            })
            }
        }
    }
])
;/********************************************************************************************************************
 *                                                     会员信息
 ********************************************************************************************************************/

angular.module("memberMoudle", []).controller('MemberCtrl', ['$scope','$rootScope','$window','memberData',
  	function($scope,$rootScope,$window,memberData) {

		// 搜索会员用户
		$scope.search = ""

		memberData.getData().then(function(data){
			$scope.memberAll = data.members
			$scope.member = $scope.memberAll
		})

		$scope.searchMember = function(value){
			$scope.member = $scope.memberAll.filter(function(ele){
        if (ele.phone) {
          if(ele.phone.indexOf(value)>=0){
  					return ele
  				}
        }
			})
		}

		// 查看会员详情
		$scope.memberDetail = function(id){
			memberData.getIdData(id).then(function(data){

				$scope.memberItem = data.member

			})
		}
	}
])
;/********************************************************************************************************************
 *                                                     储值卡信息
 ********************************************************************************************************************/

angular.module("petcardMoudle", []).controller('PetcardCtrl', ['$scope', '$rootScope', '$window', 'petcardData', 'petruleData', 'domainData', 'pospayData',
    function($scope, $rootScope, $window, petcardData, petruleData, domainData, pospayData) {

        // 搜索储值卡用户
        $scope.search = ""
        $scope.petcardNum = null
        $scope.sexes = ['男', '女']
        $scope.payTypeArr = ['现金', '微信', '支付宝']
        $scope.petcard = {
                phone: null
            }
            //初始化执行流程
        updateCombo()
        getData()

        //会员卡套餐
        function updateCombo() {
            petruleData.getData().then(function(data) {
                $scope.petrules = data.petrules
                $scope.petcard.petrule = data.petrules[0]._id
                $scope.petcard.fee = data.petrules[0].fee
                $scope.petcard.bonus = data.petrules[0].bonus
                $scope.petcard.balance = data.petrules[0].fee + data.petrules[0].bonus

            })
        }

        // 充值
        $scope.saveFunc = function() {
            $scope.petcard.pay_type = 0
            petcardData.updateData($scope.petcard).then(function(data) {
                $scope.changeAlert(data.msg)
                if (data.status == 1) {
                    $scope.petcard = {
                        phone: null
                    }
                    updateCombo()
                    getData()
                }
            })

        }

        //左侧会员列表
        function getData() {
            petcardData.getData().then(function(data) {
                $scope.petcardall = data.petcards
                $scope.petcards = $scope.petcardall
            })
        }

        //搜索
        $scope.searchPetcard = function(value) {
            $scope.petcards = $scope.petcardall.filter(function(ele) {
              if (ele.phone) {
                if(ele.phone.indexOf(value)>=0){
                  return ele
                }
              }
            })
        }
        //变化监测
        $scope.change = function(value) {

            $scope.petcard.fee = value.fee
            $scope.petcard.bonus = value.bonus
            $scope.petcard.balance = value.fee + value.bonus

        }

        $scope.selectOne = function(value) {
            $scope.petcard.phone = value

        }

        // 查看储值卡详情
        $scope.petcardDetail = function(id) {
            petcardData.getIdData(id).then(function(data) {
                $scope.petcard = data.petcard
            })
        }

        // 添加会员卡 ->  领卡错误时候，通过手动添加  * 2017-03-02 frankyoung  bug repair
        $scope.addPetcard = function(value) {
            petcardData.addPetcard(value).then(function(data) {
                $scope.changeAlert(data.msg)
                if (data.status == 1) {
                    updateCombo()
                    getData()
                }
            })

        }

        $scope.outwrap = false
        $scope.wechatHide = true
        $scope.cashboxHide = true
        $scope.selectType = function(value, index) {
            $scope.auth_code = ""
            $scope.alipay_auth_code = ""
            if (value == "现金") {
                $scope.outwrap = false
                $scope.wechatHide = false
                $scope.cashboxHide = false
            } else if (value == "微信") {
                $scope.outwrap = true
                $scope.wxshow = true
                $scope.alipayshow = false
                $scope.changeAlert("已选择微信刷卡支付，请用扫码枪扫描卡号！")

                //禁止手动结账
                $scope.wechatHide = true
                    //聚焦使用扫码枪
                document.getElementById("pet-wechat").focus()
            } else if (value == "支付宝") {
                $scope.outwrap = true
                $scope.alipayshow = true
                $scope.wxshow = false
                $scope.changeAlert("已选择支付宝刷卡支付，请用扫码枪扫描卡号！")

                $scope.wechatHide = true
                document.getElementById("pet-alipay").focus()
            }
        }

        //存入本地店id
        domainData.getShopidData().then(function(data) {
            var shopid = data.shopid
            localStorage.shopid = shopid
        })

        //微信刷卡支付
        $scope.wechatPosPay = function(code) {
            $scope.petcard.pay_type = 1
            petcardData.updateData($scope.petcard).then(function(data) {

                if (data.status == 1) {
                    var shopid = localStorage.shopid
                    var time = new Date().getTime()
                    var value = {
                        total_fee: $scope.petcard.fee,
                        auth_code: code,
                        device_info: shopid,
                        out_trade_no: shopid + time + ""
                    }

                    pospayData.setData(value).then(function(data) {
                        $scope.changeAlert(data.msg)
                        if (data.status === 1) {
                            $scope.wechatHide = false
                            $scope.petcard = {
                                phone: null
                            }
                            updateCombo()
                            getData()
                            $scope.outwrap = false
                            $scope.wechatHide = true
                        } else if (data.status === 2) { //需要输入密码，这时去查询订单的状态
                            var interval = setInterval(function() {
                                pospayData.orderData(value).then(function(orderdata) {
                                    $scope.changeAlert(orderdata.msg)
                                    if (orderdata.status === 1) {
                                        clearInterval(interval)
                                        $scope.wechatHide = false
                                        $scope.petcard = {
                                            phone: null
                                        }
                                        updateCombo()
                                        getData()
                                        $scope.outwrap = false
                                        $scope.wechatHide = true
                                    }
                                })
                            }, 5000)
                        }
                    })

                } else {
                    $scope.changeAlert(data.msg)
                }
            })

        }

        //支付宝刷卡支付
        $scope.alipayPosPay = function(code) {
            $scope.petcard.pay_type = 2
            petcardData.updateData($scope.petcard).then(function(data) {

                if (data.status == 1) {
                    var shopid = localStorage.shopid
                    var time = new Date().getTime()
                    var value = {
                        total_fee: $scope.petcard.fee,
                        auth_code: code,
                        device_info: shopid,
                        out_trade_no: shopid + time + ""
                    }

                    pospayData.setalipayData(value).then(function(data) {
                        $scope.changeAlert(data.msg)
                        if (data.status === 1) {
                            $scope.wechatHide = false
                            $scope.petcard = {
                                phone: null
                            }
                            updateCombo()
                            getData()
                            $scope.outwrap = false
                            $scope.wechatHide = true
                        } else if (data.status === 2) { //需要输入密码，这时去查询订单的状态
                            var interval = setInterval(function() {
                                pospayData.alipayOrderData(value).then(function(orderdata) {
                                    $scope.changeAlert(orderdata.msg)
                                    if (orderdata.status === 1) {
                                        clearInterval(interval)
                                        $scope.wechatHide = false
                                        $scope.petcard = {
                                            phone: null
                                        }
                                        updateCombo()
                                        getData()
                                        $scope.outwrap = false
                                        $scope.wechatHide = true
                                    }
                                })
                            }, 5000)
                        }
                    })

                } else {
                    $scope.changeAlert(data.msg)
                }
            })

        }

    }
])
;/********************************************************************************************************************
 *                                                     导航条
 ********************************************************************************************************************/

angular.module("navMoudle", []).controller('NavCtrl', ['$scope','$rootScope','$interval','dayData','orderData','itemData','overData','domainData','memberorderData','payorderData','petcardData',
  	function($scope,$rootScope,$interval,dayData,orderData,itemData,overData,domainData,memberorderData,payorderData,petcardData) {
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
					onceincome:data.onceincome,	
					cashincome:data.cashincome,	
					wxincome:data.wxincome,	
					alipayincome:data.alipayincome,	
					schoolincome:data.schoolincome,	
					otherincome:data.otherincome,	
					petcardincome:data.petcardincome,	
					cardincome:data.cardincome,	
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
  				// "date":date.today,
  				// "year":date.y,
  				// "month":date.m,
  				// "day":date.d,
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

	  	petcardData.getTodayOrderData().then(function(data){
	  		$scope.fee = data.fee
	  		$scope.bonus = data.bonus
	  		$scope.cash = data.cashincome
	  		$scope.wx = data.wxincome
	  		$scope.alipay = data.alipayincome

	  	})

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

















  ;/********************************************************************************************************************
 *                                                     点餐页面
 ********************************************************************************************************************/

angular.module("selectMoudle", []).controller('SelectCtrl', ['$scope','$window','cateData','dishData',
	function($scope,$window,cateData,dishData) {
		
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








