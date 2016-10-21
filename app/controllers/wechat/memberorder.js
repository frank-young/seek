var Memberorder = require('../models/wechat/memberorder'),
	_ = require('underscore')

	exports.add = function(req, res) {
		var _memberorder = req.body.memberorder,
			userObj = req.session.user

  			Memberorder.findOne({name:_memberorder.name},function(err,memberorder){
				if(err){
					res.json({
						status:0,
						msg:"发生未知错误！"
					})
				}
				if(memberorder){
					res.json({
						status:0,
						msg:"已经存在！"
					})	
				}else{
					var memberorder = new Memberorder(_memberorder)
					memberorder.save(function(err,memberorderdata){
						res.json({
									status:1,
									msg:"添加成功！"
								})
					})
				}
			})

	}

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

	exports.detail = function(req, res) {
		var _memberorder = req.session.user.memberorder
		Memberorder.findOne({name:_memberorder},function(err,memberorder){
			if(err){
				res.json({
					status:"0",
					msg:"发生错误!",
					err:err
				})
			}else{
				res.json({
					status:"1",
					msg:"读取成功",
					memberorder:memberorder
				})
			}
			
		})
	}

