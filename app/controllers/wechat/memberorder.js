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
						fee:memberorder.fee
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

	// 添加
	exports.add = function(req, res) {
		var memberorder = {
				shopid:"464041593",
				username:'杨军',
				code:234109834832,
				phone:'18608164404',
				status:1,
				billstatus:0,
			}

			var _memberorder = new Memberorder(memberorder)
			_memberorder.save(function(err,memberorderdata){
				res.json({
						status:1,
						msg:"添加成功！"
					})
			})

	}

	// 更新
	exports.update = function(req, res) {
		var memberorderObj = req.body.memberorder
		var user = req.session.user
		var _memberorder

		Memberorder.findOne({name:user.memberorder},function(err,memberorder){
			if(err){
				console.log(err)
			}
			_memberorder = _.extend(memberorder,memberorderObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
			_memberorder.save(function(err,memberorder){
				if(err){
					console.log(err)
				}

				res.json({msg:"更新成功",status: 1})
			})
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

