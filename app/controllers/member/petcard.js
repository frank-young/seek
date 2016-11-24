var Petcard = require('../../models/member/petcard'),	//引入模型
	Domain = require('../../models/domain'),	//引入模型
	_ = require('underscore'),
	https = require('https'),
	request = require('request'),
	fs = require('fs')
	
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
	//储值卡充值
	exports.update = function(req,res){
		var petcardObj = req.body.petcard 
		var user = req.session.user
		var _petcard
		var rePhone = /^1[3|5|4|7|8]\d{9}$/

		petcardObj.edit_people = user.name
		petcardObj.domainlocal = user.domain

		if(petcardObj.phone == "" || petcardObj.phone == null || petcardObj.phone == "undefined"){
			res.json({
				status:0,
				msg:"手机号不能为空！"
			})
		}else if(petcardObj.balance == "" || petcardObj.balance == null || petcardObj.balance == "undefined"){
			res.json({
				status:0,
				msg:"充值金额不能为空！"
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
						res.json({msg:"发送错误，请联系管理员！",status: 0})
					}else{
						Domain.findOne({"name":user.domain},function(err,domain){
							record_balance = '充值成功！充值金额：'+Math.round(petcardObj.fee*100)/100+'元,赠送金额：'+Math.round(petcardObj.bonus*100)/100+'元。'
							petcardObj.position = domain.pname
							petcardObj.fee = Math.round(petcardObj.fee*100)/100 + petcard.fee
							petcardObj.bonus = Math.round(petcardObj.bonus*100)/100 + petcard.bonus
							petcardObj.balance	= Math.round(petcardObj.balance*100)/100 + petcard.balance

							_petcard = _.extend(petcard,petcardObj)
							_petcard.save(function(err,petcarddata){
								if(err){
									console.log(err)
								}
								//这里需要同步 微信数据，这时再将 fee ，bonus balance *100
								
								var formdata ={
						 			"code": petcarddata.code,
									"card_id":petcarddata.cardid,
								    "record_bonus": "",
								    "bonus":petcarddata.int,
								    "balance":parseInt(petcarddata.balance*100),
								    "record_balance": record_balance,
								    "notify_optional": {
								        "is_notify_bonus": true,
								        "is_notify_balance": true,
								        "is_notify_custom_field1":true
								    }
								 }

								 updateMember(formdata,petcarddata.openid,res)		//微信更新会员卡接口
								
							})
						})
					}
				}
			})
		}
	}

	//储值卡消费
	exports.reduce = function(req,res){
		var petcardObj = req.body.petcard 
		var user = req.session.user
		var _petcard
		var recode = /^\d{12}$/

		petcardObj.edit_people = user.name
		petcardObj.domainlocal = user.domain

		if(petcardObj.code == "" || petcardObj.code == null || petcardObj.code == "undefined"){
			res.json({
				status:0,
				msg:"卡号不能为空！"
			})
		}else if(petcardObj.total_fee == "" || petcardObj.total_fee == null || petcardObj.total_fee == "undefined"){
			res.json({
				status:0,
				msg:"消费金额不能为空！"
			})
		}
		else if(recode.test(petcardObj.code) == false){
			res.json({
				status:0,
				msg:"卡号格式不正确！"
			})
		}else{
			Petcard.findOne({"code":petcardObj.code},function(err,petcard){
				if(!petcard){
					res.json({msg:"卡号号不存在",status: 0})
				}else{
					if(err){
						res.json({msg:"系统错误，请联系管理员！",status: 0})
					}else{
						record_balance = '您的储值会员卡成功在Seek Cafe消费'+Math.round(petcardObj.total_fee*100)/100+'元,欢迎下次光临！'
						record_bonus = ''

						petcardObj.balance = petcard.balance - Math.round(petcardObj.total_fee*100)/100
						petcardObj.int = petcard.int + petcardObj.int

						_petcard = _.extend(petcard,petcardObj)
						_petcard.save(function(err,petcarddata){
							if(err){
								console.log(err)
							}
							
							var formdata ={
					 			"code": petcarddata.code,
								"card_id":petcarddata.cardid,
							    "record_bonus": record_bonus,
							    "bonus":petcarddata.int,
							    "balance":parseInt(petcarddata.balance*100),
							    "record_balance": record_balance,
							    "notify_optional": {
							        "is_notify_bonus": true,
							        "is_notify_balance": true,
							        "is_notify_custom_field1":true
							    }
							 }

							 updateMember(formdata,res)		//微信更新会员卡接口
							
						})
					}
  
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

	function updateMember(formdata,openid,res){
		var access_token = fs.readFileSync('./config/token').toString();
		var url = 'https://api.weixin.qq.com/card/membercard/updateuser?access_token='+access_token

		var options = {
		    url: url,
		    form: JSON.stringify(formdata),
		    headers: {
		      'Content-Type': 'application/x-www-form-urlencoded'
		    }
		}

		request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body)
				// res.json({
				// 	status:1,
				// 	msg:'操作成功！',
				// 	data:data
				// })
				tempReplay(openid,res)

			}
		})
	}

	//发送模板消息函数
	function tempReplay(openid,res){
		var access_token = fs.readFileSync('./config/token').toString();
		var url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+access_token

		var formdata =  {
	           "touser":openid,
	           "template_id":"Z8hZ8g5SF5c4cV-eaXOVHhSRoDlnFjHiYWHRiHyRmUk",     
	           "data":{
	                   "first": {
	                       "value":"恭喜你充值成功！"
	                   },
	                   "accountType":{
	                       "value":"会员卡号"
	                   },
	                   "account":{
	                       "value":"11912345678"
	                   },
	                   "amount": {
	                       "value":"50元"
	                   },
	                   "result": {
	                       "value":"2016年11月24日"
	                   },
	                   "remark":{
	                       "value":"有疑问请请致电022-2236548联系我们。"
	                   }
	           }
	       }

		var options = {
		    url: url,
		    form: JSON.stringify(formdata),
		    headers: {
		      'Content-Type': 'application/x-www-form-urlencoded'
		    }
		}

		request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body)
				res.json({
					status:1,
					msg:'操作成功',
					data:data
				})

			}
		})
	}