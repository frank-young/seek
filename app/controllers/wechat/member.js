var Member = require('../../models/wechat/member'),
	_ = require('underscore')

	// 添加
	// exports.add = function(req, res) {
	// 	var member = {
	// 			shopid:"464041593",
	// 			username:'杨军',
	// 			code:234109834832,
	// 			phone:'18608164404',
	// 			status:1,
	// 			billstatus:0,
	// 		}

	// 		var _member = new Member(member)
	// 		_member.save(function(err,memberdata){
	// 			res.json({
	// 					status:1,
	// 					msg:"添加成功！"
	// 				})
	// 		})

	// }

	// 列表
	exports.list = function(req,res){
		var user = req.session.user

		Member.fetch(function(err,members){
			res.json({
				msg:"请求成功",
				status: 1,
				members:members
			})
		})
	}


	// 详情
	exports.detail = function(req, res) {
		var _member = req.session.user.member
		Member.findOne({name:_member},function(err,member){
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
					member:member
				})
			}
			
		})
	}

