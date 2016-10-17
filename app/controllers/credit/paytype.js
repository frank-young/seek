var Paytype = require('../../models/credit/paytype')	//引入模型
var _ = require('underscore')
	
	//分类列表页
	exports.list = function(req,res){
		var user = req.session.user
		Paytype.fetch({"domainlocal":user.domain},function(err,paytypes){
			res.json({
				status:"1",
				msg:"请求成功",
				paytypes:paytypes
			})
		})
	}
	//分类更新、新建
	exports.save = function(req,res){
		var paytypeObj = req.body.paytype 	//从路由传过来的 paytype对象
		var user = req.session.user
		var _paytype
			_paytype = new Paytype({
				isEdit: paytypeObj.isEdit,
				value:paytypeObj.value,
				label:paytypeObj.label,
				checked:paytypeObj.checked,
				userlocal:user.email,
				domainlocal:user.domain
			})
			_paytype.save(function(err,paytype){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}
	//分类更新、新建
	exports.update = function(req,res){
		var id = req.body.paytype._id
		var paytypeObj = req.body.paytype 	//从路由传过来的 paytype对象
		var _paytype
		if(id !=="undefined"){
			Paytype.findById(id,function(err,paytype){
				if(err){
					console.log(err)
				}
				_paytype = _.extend(paytype,paytypeObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_paytype.save(function(err,paytype){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	//删除分类
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Paytype.remove({_id: id},function(err,paytype){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}


