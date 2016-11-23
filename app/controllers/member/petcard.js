var Petcard = require('../../models/member/petcard')	//引入模型
var _ = require('underscore')
	
	//储值卡列表页
	exports.list = function(req,res){
		var user = req.session.user
		Petcard.fetch(function(err,petcards){
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

		petcardObj.code = '960904691623'
		petcardObj.edit_people = user.name
		petcardObj.domainlocal = user.domain

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
		var petcardObj = req.body.petcard 
		var _petcard
		var rePhone = /^1[3|5|7|8]\d{9}$/
		if(petcardObj.phone == "" || petcardObj.phone == null){
			res.json({
				status:0,
				msg:"手机号不能为空！"
			})
		}
		else if(rePhone.test(petcardObj.phone) == false){
			res.json({
				status:0,
				msg:"手机号格式不正确！"
			})
		}else{
			Petcard.findOne({"phone":petcardObj.phone},function(err,petcard){
				if(!petcard){
					res.json({msg:"手机号不存在",status: 0})
				}else{
					if(err){
					console.log(err)
					}
					console.log(petcard.balance)
					petcardObj.fee += petcard.fee
					petcardObj.bonus += petcard.bonus
					petcardObj.balance	+= petcard.balance
					_petcard = _.extend(petcard,petcardObj)	
					_petcard.save(function(err,petcard){
						if(err){
							console.log(err)
						}
						res.json({msg:"充值成功！",status: 1})
						//这里需要同步 微信数据，这时再将 fee ，bonus balance *100
						
						
					})

				}
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
	
	function createCode(){
		Petcard.fetch(function(err,petcards){
			
		})
	}


	