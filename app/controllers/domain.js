var Domain = require('../models/domain'),
	User = require('../models/user'),
	_ = require('underscore')

	exports.add = function(req, res) {
		res.render('domainadd', {
	  	  	title: '添加门店页面'
	  	})
	}

	//添加
	exports.addctrl = function(req,res){
		var _domain = req.body.domain,
			userObj = req.session.user
  		var re = /^[A-Za-z0-9]+$/

  		if(_domain.name==""){
  			res.json({
				status:0,
				msg:"门店不能为空！"
			})
  		}else if(_domain.name=="www"||_domain.name=="WWW"){
  			res.json({
				status:0,
				msg:"门店不能为www噢！"
			})
  		}else if(re.test(_domain.name)==false){
  			res.json({
				status:0,
				msg:"门店格式不正确，必须为字母或数字！"
			})
  		}else if(_domain.name.length<3){
  			res.json({
				status:0,
				msg:"门店长度必须大于3个字符，小于10个字符！"
			})
  		}else if(_domain.name.length>15){
  			res.json({
				status:0,
				msg:"门店长度必须大于3个字符，小于15个字符！"
			})
  		}else{
  			Domain.findOne({name:_domain.name},function(err,domain){
				if(err){
					res.json({
						status:0,
						msg:"发生未知错误！"
					})
				}
				if(domain){
					res.json({
						status:0,
						msg:"门店已经存在！"
					})	
				}else{
					var domain = new Domain(_domain)
					domain.save(function(err,domain){
						User.update({_id:userObj._id},
							{$set:{domain:_domain.name}},function(err){
								if(err){
									res.json({
										status:0,
										msg:"发生未知错误！"
									})
								}
								req.session.user.domain = _domain.name 		//更新session,添加domain来模拟存在
								res.json({
									status:1,
									msg:"添加成功！"
								})
							})
					})
				}
			})
  		}

	}
	
	exports.update = function(req, res) {
		var domainObj = req.body.domain
		var user = req.session.user
		var _domain

		Domain.findOne({name:user.domain},function(err,domain){
			if(err){
				console.log(err)
			}
			_domain = _.extend(domain,domainObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
			_domain.save(function(err,domain){
				if(err){
					console.log(err)
				}

				res.json({msg:"更新成功",status: 1})
			})
		})
		

	}
	exports.detail = function(req, res) {
		var _domain = req.session.user.domain
		Domain.findOne({name:_domain},function(err,domain){
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
					domain:domain
				})
			}
			
		})
	}
	//门店权限
	exports.domainRequired = function(req,res,next){
		var userObj = req.session.user
		//判断是否有门店
		if(userObj.domain){
			res.redirect("/#/index")
			return 
		}
		next()
	}

	//获取微信端shopid ,相当于客户端用户凭证
	exports.shopid = function(req, res) {
		var _domain = req.session.user.domain
		Domain.findOne({name:_domain},function(err,domain){
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
					shopid:domain.shopid
				})
			}
			
		})
	}