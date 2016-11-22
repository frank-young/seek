/********************************************************************************************************************
 *                                                     储值卡信息
 ********************************************************************************************************************/

angular.module("petcardMoudle", []).controller('PetcardCtrl', ['$scope','$rootScope','$window','petcardData','petruleData','domainData','pospayData',
  	function($scope,$rootScope,$window,petcardData,petruleData,domainData,pospayData) {

		// 搜索储值卡用户
		$scope.search = ""
		$scope.sexes = ['男','女']
		$scope.payTypeArr = ['现金','微信','支付宝']
		$scope.petcard={
			sex:'男',
			petrule:'1',
			birthday:null
		}

		//会员卡套餐
		petruleData.getData().then(function(data){
			$scope.petrules = data.petrules
			$scope.petcard.petrule = data.petrules[0]._id
			$scope.petcard.fee = data.petrules[0].fee
			$scope.petcard.bonus = data.petrules[0].bonus
			$scope.petcard.balance = data.petrules[0].fee + data.petrules[0].bonus
		})

		//变化监测
		$scope.change = function(value){
			var history = []
			history.unshift({msg:value.name})

			$scope.petcard.fee = value.fee
			$scope.petcard.bonus = value.bonus
			$scope.petcard.balance = value.fee + value.bonus
			
		}

		// 保存储值卡
		$scope.saveFunc = function(){
			$scope.petcard.type = '储值卡'
			$scope.petcard.has_active = true
			$scope.petcard.status = 1
			$scope.petcard.card_grade = 0
			$scope.petcard.int = 0
			$scope.petcard.discount = 0

			petcardData.addData($scope.petcard).then(function(data){
				$scope.changeAlert(data.msg)
			})
			petcardData.getData().then(function(data){
				$scope.petcards = data.petcards
			})
		}

		//左侧会员列表
		petcardData.getData().then(function(data){
			$scope.petcards = data.petcards
		})
		
		//搜索
		$scope.searchPetcard = function(value){
			$scope.petcard = $scope.petcards.filter(function(ele){
				if(ele.phone.indexOf(value)>=0){
					return ele
				}
			})
		}

		// 查看储值卡详情
		$scope.petcardDetail = function(id){
			petcardData.getIdData(id).then(function(data){
				$scope.petcard = data.petcard
			})
		}

		$scope.outwrap = false
		$scope.wechatHide = true
		$scope.selectType = function(value,index){
			if(value == "现金"){
				$scope.outwrap = false
				$scope.wechatHide = false
			}else if(value == "微信"){
				$scope.outwrap = true
				$scope.wxshow = true
				$scope.alipayshow = false
				$scope.changeAlert("已选择微信刷卡支付，请用扫码枪扫码！")

				//禁止手动结账
				$scope.wechatHide = true
				//聚焦使用扫码枪
				document.getElementById("pet-wechat").focus()
			}else if(value == "支付宝"){
				$scope.outwrap = true
				$scope.alipayshow = true
				$scope.wxshow = false
				$scope.changeAlert("已选择支付宝刷卡支付，请用扫码枪扫码！")

				$scope.wechatHide = true
				document.getElementById("pet-alipay").focus()
			}
		}

		//存入本地店id
		domainData.getShopidData().then(function(data){
			var shopid = data.shopid 
			localStorage.shopid = shopid
		})

		//微信刷卡支付
		$scope.wechatPosPay =function(code){
			console.log($scope.petcard.fee)
			var shopid = localStorage.shopid
			var time = new Date().getTime()
			var value = {
				total_fee:$scope.petcard.fee,
				auth_code:code,
				device_info:shopid,
				out_trade_no:shopid+time+""
			}

			pospayData.setData(value).then(function(data){
				$scope.changeAlert(data.msg)
				if(data.status === 1){
					$scope.wechatHide = false
					$scope.saveFunc()
				}else if(data.status === 2){ //需要输入密码，这时去查询订单的状态
					var interval = setInterval(function(){
						pospayData.orderData(value).then(function(orderdata){
							$scope.changeAlert(orderdata.msg)
							if(orderdata.status === 1){
								clearInterval(interval)
								$scope.wechatHide = false
								$scope.saveFunc()
							}
						})
					},5000)
				}
			})
		}

		//支付宝刷卡支付
		$scope.alipayPosPay =function(code){
			var shopid = localStorage.shopid
			var time = new Date().getTime()
			var value = {
				total_fee:$scope.petcard.fee,
				auth_code:code,
				device_info:shopid,
				out_trade_no:shopid+time+""
				
			}

			pospayData.setalipayData(value).then(function(data){
				$scope.changeAlert(data.msg)
				if(data.status === 1){
					$scope.wechatHide = false
					$scope.saveFunc()
				}
			})
		}

	}
])








