var Member = require('../../models/wechat/member'),
	request = require('request'),
	_ = require('underscore')

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
		var id = req.params.id	
		Member.findById(id,function(err,member){
			res.json({
				status:1,
				msg:'读取成功！',
				member: member
			})
		})
	}


















