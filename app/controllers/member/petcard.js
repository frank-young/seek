var Petcard = require('../../models/member/petcard')	//引入模型
var _ = require('underscore')
	
	//储值卡列表页
	exports.list = function(req,res){
		var user = req.session.user
		Petcard.fetch({"domainlocal":user.domain},function(err,petcards){
			res.json({
				status:"1",
				msg:"操作成功",
				petcards:petcards
			})
		})
	}
	//储值卡更新、新建
	exports.save = function(req,res){
		var petcardObj = req.body.petcard 
		var user = req.session.user
		var _petcard
			_petcard = new Petcard(petcardObj)
			_petcard.save(function(err,petcard){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}
	//储值卡更新、新建
	exports.update = function(req,res){
		var id = req.body.petcard._id
		var petcardObj = req.body.petcard 
		var _petcard
		if(id !=="undefined"){
			Petcard.findById(id,function(err,petcard){
				if(err){
					console.log(err)
				}
				_petcard = _.extend(petcard,petcardObj)	
				_petcard.save(function(err,petcard){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	//储值卡详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Petcard.findById(id,function(err,petcard){
			res.json({
				petcard:petcard
			})
		})
	}

	//删除储值卡
	// exports.del = function(req,res){
	// 	var id = req.query.id
	// 	if(id){
	// 		Petcard.remove({_id: id},function(err,petcard){
	// 			if(err){
	// 				console.log(err)
	// 			}else{
	// 				res.json({status: 1,msg:"删除成功"})
	// 			}
	// 		})
	// 	}
	// }


	