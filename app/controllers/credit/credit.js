var Credit = require('../../models/credit/credit')	//引入模型
var _ = require('underscore')
	
	//分类列表页
	exports.list = function(req,res){
		var user = req.session.user
		Credit.fetch({"userlocal":user.email},function(err,credits){
			res.json({
				status:"1",
				msg:"请求成功",
				credits:credits
			})
		})
	}
	//分类更新、新建
	exports.save = function(req,res){
		var creditObj = req.body.credit 	//从路由传过来的 credit对象
		var user = req.session.user
		var _credit
			_credit = new Credit({
				isEdit: creditObj.isEdit,
				value:creditObj.value,
				label:creditObj.label,
				checked:creditObj.checked,
				userlocal:user.email,
				domainlocal:user.domain
			})
			_credit.save(function(err,credit){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}
	//分类更新、新建
	exports.update = function(req,res){
		var id = req.body.credit._id
		var creditObj = req.body.credit 	//从路由传过来的 credit对象
		var _credit
		if(id !=="undefined"){
			Credit.findById(id,function(err,credit){
				if(err){
					console.log(err)
				}
				_credit = _.extend(credit,creditObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_credit.save(function(err,credit){
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
			Credit.remove({_id: id},function(err,credit){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}


