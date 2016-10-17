var User = require('../models/user')	//引入模型
	
	//get user info 个人设置页面
	exports.data = function(req,res){
		var email = req.session.user.email
		if(email){
			User.findOne({email: email},function(err,user){
				res.json({
					user:user
				})
			})
		}
	}
	// update user
	exports.update = function(req,res){
		var email = req.session.user.email
		var user = req.body.setting
		if(email){
			User.update({email: email},
				{$set:{
						name:user.name,
						role:user.role,
						tel:user.tel,
						phone:user.phone,
						fax:user.fax,
						sex:user.sex,
						birthday:user.birthday
					}},function(err){
						if(err){
							res.json({
								status:"0",
								msg:"发生错误!",
								err:err
							})
						}else{
							res.json({
								status:"1",
								msg:"更新成功!"
							})
						}
					
			})
		}
	}
	exports.add = function(req,res){
		var _user = req.body.setting
		_user.domain = req.session.user.domain  	// 加入域名，相当于给予他房间钥匙
		// _user.role = 0 		//  设置权限
		_user.status = 1 		//  默认激活

		var rePhone = /^1[3|5|7|8]\d{9}$/
		var reEmail=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
		var rePassword = /^[\w\@\.\_]+$/

		//验证
		if(_user.email == "" || _user.email == null){
			res.json({
				status:0,
				msg:"邮箱不能为空！"
			})
		}else if(reEmail.test(_user.email) == false){
			res.json({
				status:0,
				msg:"邮箱格式不正确！"
			})
		}else if(_user.phone == "" || _user.phone == null){
			res.json({
				status:0,
				msg:"手机号不能为空！"
			})
		}else if(rePhone.test(_user.phone) == false){
			res.json({
				status:0,
				msg:"手机号格式不正确！"
			})
		}
		else if(_user.name == "" || _user.name == null){
			res.json({
				status:0,
				msg:"姓名不能为空！"
			})
		}else if(_user.password == "" || _user.password == null){
			res.json({
				status:0,
				msg:"密码不能为空！"
			})
		}else if(rePassword.test(_user.password)==false){
			res.json({
				status:0,
				msg:"密码格式不正确，必须为字母、数字、下划线！"
			})
		}else if(_user.password.length<6){
			res.json({
				status:0,
				msg:"密码长度必须大于6位，小于20位！"
			})
		}else if(_user.password.length>20){
			res.json({
				status:0,
				msg:"密码长度必须大于6位，小于20位！"
			})
		}else{
			User.findOne({phone:_user.phone},function(err,phone){
				if(phone){
					res.json({
						status:0,
						msg:"手机号已经存在！"
					})
				}else{
					User.findOne({email:_user.email},function(err,email){
						if(err){
							res.json({
								status:"0",
								msg:"发生错误!",
								err:err
							})
						}
						if(email){
							res.json({status:"0",msg:"成员已经存在了!"})
						}else{
							var user = new User(_user)
							user.save(function(err,userdata){
								if(err){
									res.json({status:"0",msg:"发生错误!"})
								}else {
									res.json({status:"1",msg:"成员保存成功!"})
								}
							})
						}
					})
				}
			})
		}
	
	}

	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			User.remove({_id: id},function(err,quotation){
				if(err){
					res.json({
						status:"0",
						msg:"发生错误!",
						err:err
					})
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成员成功!"})
				}
			})
		}
	}

	/* 成员列表 */
	exports.list = function(req,res){
		var user = req.session.user
		User.fetch({'domain':user.domain,"role":{"$lt":10}},function(err,users){
			// 查询权限小于10的成员
			res.json({
				status:"1",
				users:users
			})
		})
	}

	/* 收银员列表 */
	exports.list = function(req,res){
		var user = req.session.user
		User.fetch({'domain':user.domain,"role":0},function(err,users){
			res.json({
				status:"1",
				users:users
			})
		})
	}

	/* 成员详情 */
	exports.detail = function(req,res){
		var id = req.params.id

		User.findById(id,function(err,user){
			if(err){
				res.json({
					status:"0",
					msg:"发生错误!",
					err:err
				})
			}else{
				res.json({
					user:user
				})
			}
			
		})
	}
	/* 成员更新 */
	exports.updatecopy = function(req,res){
		var setting = req.body.setting
		if(setting.email){
			console.log(setting.name)
			if(setting.name == null){
				res.json({
					status:0,
					msg:"姓名不能为空！"
				})
			}else{
				User.update({email: setting.email},
					{$set:{
							name:setting.name,
							role:setting.role,
							section:setting.section,
							position:setting.position,
							tel:setting.tel,
							fax:setting.fax,
							sex:setting.sex,
							birthday:setting.birthday,
							city:setting.city
						}
					},function(err){
						if(err){
							res.json({
								status:"0",
								msg:"发生错误!",
								err:err
							})
							console.log(err)
						}else{
							res.json({
								status:"1",
								msg:"更新成功!"
							})
						}
							
				})
			}
			
		}
	}
	//权限值
	exports.rbac = function(req,res){
		var user = req.session.user
		if(user){
			res.json({rbac:user.role})
		}else{
			res.json({rbac:0})
		}
	}

	//空间管理员权限
	exports.placeAdminRequired = function(req,res,next){
		var user = req.session.user
		if(user.role < 10 ){
			return res.json({status: 1,msg:"你没有操作权限！"})
		}
		next()
	}

	







