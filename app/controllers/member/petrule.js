var Petrule = require('../../models/member/petrule')
var _ = require('underscore')
	
	//储值卡规则列表页
	exports.list = function(req,res){
		var user = req.session.user
		Petrule.fetch({"domainlocal":user.domain},function(err,petrules){
			res.json({
				status:"1",
				msg:"操作成功",
				petrules:petrules
			})
		})
	}
	//储值卡规则更新、新建
	exports.save = function(req,res){
		var petruleObj = req.body.petrule 
		var user = req.session.user
		var _petrule
			_petrule = new Petrule(petruleObj)
			_petrule.save(function(err,petrule){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}
	//储值卡规则更新、新建
	exports.update = function(req,res){
		var id = req.body.petrule._id
		var petruleObj = req.body.petrule 
		var _petrule
		if(id !=="undefined"){
			Petrule.findById(id,function(err,petrule){
				if(err){
					console.log(err)
				}
				_petrule = _.extend(petrule,petruleObj)	
				_petrule.save(function(err,petrule){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	//储值卡规则详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Petrule.findById(id,function(err,petrule){
			res.json({
				petrule:petrule
			})
		})
	}

	// 删除储值卡规则
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Petrule.remove({_id: id},function(err,petrule){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}


	