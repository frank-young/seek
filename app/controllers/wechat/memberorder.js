var Memberorder = require('../../models/wechat/memberorder'),
	_ = require('underscore')

	// 客户端查询会员用户付款信息
	exports.getinfo = function(req, res) {
		var _shopid = req.body.shopid
		// 这里我需要去查询本店铺的用户付款信息，数据库中有的相应店铺的shopid值
		Memberorder.findOne({shopid:_shopid,status:1,billstatus:0},function(err,memberorder){
			if(err){
				res.json({
					status:0,
					msg:"发生错误!",
					err:err
				})
			}
			if(memberorder){
				memberorderObj = {
					billstatus: 1
				}
				_memberorder = _.extend(memberorder,memberorderObj)	// 付款成功，更新此订单付款为完成状态
				_memberorder.save(function(err,memberorderdata){

				})
				res.json({
					status:1,
					msg:"付款成功",
					member:{
						username: memberorder.username,
						phone: memberorder.phone,
						code: memberorder.code,
						fee:memberorder.fee,
						discount:memberorder.discount
					}
				})

			}
			else{
				res.json({
					status:0,
					msg:"暂时未有付款成功消息"
				})
			}
			
		})

	}

	// 详情
	exports.detail = function(req, res) {
		var _memberorder = req.session.user.memberorder
		Memberorder.findOne({name:_memberorder},function(err,memberorder){
			if(err){
				res.json({
					status:0,
					msg:"发生错误!",
					err:err
				})
			}else{
				res.json({
					status:1,
					msg:"读取成功",
					memberorder:memberorder
				})
			}
			
		})
	}

	exports.todayMemberPay = function(req, res) {
		var shopid = req.params.id
		var date = new Date(),
			Y = date.getFullYear(),
        	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
        	D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		Memberorder.fetch({"shopid":shopid,"year":Y,"month":M,"day":D},function(err,orders){
			var wxpay = 0
			orders.forEach(function(ele){
				wxpay += ele.fee/100 
			})
			res.json({
					status:1,
					msg:"读取成功",
					wxpay:wxpay
				})

		})
	}










