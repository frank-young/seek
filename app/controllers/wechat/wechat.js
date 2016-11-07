var jsSHA = require('jssha'),
	https = require('https'),
	request = require('request'),
	fs = require('fs'),
	Memberorder = require('../../models/wechat/memberorder')
	Member = require('../../models/wechat/member')
	

// 暂时用的第一张卡： pV8Fpwyw7-wnfqRIIIQjZwWrBhuU	-> 747522939375  
// 第二张会员卡： pV8Fpw9Ma8psDpx_07EwvnmUulJc  -> 341233892893   ->047543802458
// "pV8Fpw-srHIlmA1ZsDI0aO55X96M" -> 542105098925
// pV8Fpw_0Wt3USdpKKF_cj7yCX-nA
//pV8Fpw4Ueri-rldrK83zQJW9NVkE
var config = {
	wechat:{
		appID:'wx782db8ee3e80c4aa',			//      wxd95a4f3e82e0df64
		appSecret:'07edc09a46dba2e8d0b1964b5aec3a46',		//       143d36866e792512dc76ea5d11e8df62
		token:'weixin'
	},
	card: "pQw7gvwsk30k4xreKQma_GUlwKNw",
	code: "435350747055"
}

//微信端验证 以及推送事件
exports.init = function(req, res) {
    // var token="weixin"
    var signature = req.query.signature
    var timestamp = req.query.timestamp
    var echostr   = req.query.echostr
    var nonce     = req.query.nonce

    var oriArray = new Array()
    oriArray[0] = nonce
    oriArray[1] = timestamp
    oriArray[2] = config.wechat.token
    oriArray.sort()

    var original = oriArray.join('')


    var shaObj = new jsSHA(original, 'TEXT')
    var scyptoString=shaObj.getHash('SHA-1', 'HEX')

    if(signature == scyptoString){
        //验证成功
        console.log('验证成功！')
        res.end(echostr);
    } else {
        //验证失败
        console.log('验证失败')
        res.end("false")

    }

}

//获取token
exports.token = function(req,res){

	var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wechat.appID+'&secret='+config.wechat.appSecret
	
	var saveToken = function(){
		request(url, function (error, response, body) {
		  	if (!error && response.statusCode == 200) {
		    	console.log(JSON.parse(body)) 
		    	var data  = JSON.parse(body)
		    	var token = data.access_token

		    	fs.writeFile('./config/token', token, function (err) {
			  		res.json({
			  			status:1,
			  			msg:'获取access_token成功',
			  			token:token
			  		})
				})
			}
		})
	}
	saveToken()
}

//添加菜单
exports.addMenu = function(req,res){

	//token，因为token是存在文件里的所以这里进行文件读取得到token
	var access_token = fs.readFileSync('./config/token').toString();

	var menus = {
	  "button": [
	    {
	      "name": "会员信息",
	      "sub_button": [
	        {
	          "type": "view",
	          "name": "我的会员",
	          "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd95a4f3e82e0df64&redirect_uri=http%3A%2F%2F39778151.ngrok.natapp.cn/wechat/login&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
	        },
	        {
	          "type": "view",
	          "name": "优惠信息",
	          "url": "http://60.205.157.200"
	        }]
	    },
	    {
	      "name": "关于我们",
	      "sub_button": [
	        {
	          "type": "view",
	          "name": "关于我们",
	          "url": "http://www.nanafly.com"
	        }]
	    },
	    {
	      "name": "联系我们",
	      "sub_button": [
	        {
	          "type": "view",
	          "name": "联系我们",
	          "url": "http://www.nanafly.com"
	        }]
	    }
	    ]
	}
	var options = {
	    url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + access_token,
	    form: JSON.stringify(menus),
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }
	  }
	  
	  request.post(options, function (err, response, body) {
	    if (err) {
	      console.log(err)
	      
	    }else {
	      console.log(body)
	      res.json({
	      	status:1,
			msg:'添加自定义菜单成功'
	      })
	    }
	  })
}

// 微信授权登录
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd95a4f3e82e0df64&redirect_uri=http%3A%2F%2Fy7gr8.ngrok.natapp.cn%2Fwechat%2Flogin&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
exports.login = function(req,res){
	var code = req.query.code
	// 用获取code换取token
	var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+config.wechat.appID+'&secret='+config.wechat.appSecret+'&code='+code+'&grant_type=authorization_code'
	var saveToken = function(){
		request(url, function (error, response, body) {
		  	if (!error && response.statusCode == 200) {
		    	var data  = JSON.parse(body)
		    	var token = data.access_token
		    	var refresh_token = data.refresh_token
		    	var openid = data.openid

		    	fs.writeFile('./config/web_token', token, function (err) {
				})
				fs.writeFile('./config/refresh_token', refresh_token, function (err) {
				})
				fs.writeFile('./config/openid', openid, function (err) {
				})

				res.redirect('/wechat/userinfo')

			}else{
				res.json({
					status:0,
					msg:'已经授权过了'
				})

			}
		})
	}
	saveToken()
	// var refreshUrl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid='+config.wechat.appID+'&grant_type=refresh_token&refresh_token=REFRESH_TOKEN'
	
}

// 用户信息
exports.userinfo = function(req,res){
	res.render('wechat/userinfo',{
		title:'SEEK CAFE',
	})

}

// 办理会员卡
exports.memberAppaly = function(req,res){
	var access_token = fs.readFileSync('./config/web_token').toString();
	var openid = fs.readFileSync('./config/openid').toString();

	var url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
	var sexArr = ['未知','男','女']

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body)
			res.render('wechat/member_appaly',{
				title:'激活会员卡',
				username:data.nickname,
				sex:sexArr[data.sex],
				province:data.province,
				city:data.city,
				country:data.country,
				headimgurl:data.headimgurl

			})
		}
	})

}

// 门店图片上传
exports.uploadImage = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token='+access_token

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body)
			res.json({
				data:data
			})
		}
	})

}


// 创建会员卡
exports.cardCreate = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/create?access_token='+access_token

	var formdata = {
		"card":{
		    "card_type": "MEMBER_CARD",
		    "member_card": {
		        "base_info": {
		            "id": "pQw7gv3-fLxpHzSpU1Yl21r1ukrE",
		            "logo_url": "http://mmbiz.qpic.cn/mmbiz_jpg/mGo9xJx8oaCxW0ARn1PnZQz1onVdWAiaYqr9eO1q2icOlhHhd2XLcmUFic8NHjlpOfVGg0p9HRI5ueGLhIFhOEIQQ/0?wx_fmt=jpeg",
		            "code_type": "CODE_TYPE_QRCODE",
		            "brand_name": "Seek Cafe",
		            "title": "普通会员",
		            "sub_title": "",
		            "date_info": {
		                "type": "DATE_TYPE_PERMANENT"
		            },
		            "color": "Color010",
		            "notice": "用户到店出示会员卡",
		            "description": "",
		            "location_id_list": [
		                464002036,
		                464041593
		            ],
		            "get_limit": 1,
		            "can_share": true,
		            "can_give_friend": false,
		            "status": "CARD_STATUS_DISPATCH",
		            "sku": {
		                "quantity": 999999999,
		                "total_quantity": 1000000000
		            },
		            "create_time": 1476862469,
		            "update_time": 1476886471,
		            "use_all_locations": true,
		            "area_code_list": []
		        },
		        "supply_bonus": true,
		        "supply_balance": true,
		        "prerogative": "用卡可享受9.5折优惠\n10积分可兑换精美礼品；会员日可享受折上折优惠等",
		        "discount": 5,
		        "auto_activate": false,
		        "wx_activate": true,
		        "bonus_rule": {
		            "cost_money_unit": 10000,
		            "increase_bonus": 1,
		            "cost_bonus_unit": 1,
		            "reduce_money": 100
		        },
		        "background_pic_url": "",
		        "advanced_info": {
		            "time_limit": [
		                {
		                    "type": "MONDAY"
		                },
		                {
		                    "type": "TUESDAY"
		                },
		                {
		                    "type": "WEDNESDAY"
		                },
		                {
		                    "type": "THURSDAY"
		                },
		                {
		                    "type": "FRIDAY"
		                },
		                {
		                    "type": "SATURDAY"
		                },
		                {
		                    "type": "SUNDAY"
		                }
		            ],
		            "text_image_list": [],
		            "business_service": [
		                "BIZ_SERVICE_FREE_WIFI"
		            ],
		            "consume_share_card_list": [],
		            "use_condition": {
		                "can_use_with_other_discount": false,
		                "can_use_with_membercard": false
		            },
		            "share_friends": false
		        }
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
				msg:'1',
				data:data
			})
		}
	})

}

// 创建二维码
exports.cardQrcode = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/qrcode/create?access_token='+access_token

	var formdata ={
			"action_name": "QR_CARD", 
			"expire_seconds": 1800,
			"action_info": {
				"card": {
					"card_id":config.card
					
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
				msg:'1',
				data:data
			})

			// {
			//     "errcode": 0,
			//     "errmsg": "ok",
			//     "ticket": "gQHk8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2ZqaGI4Si1sYU80UjgzQzdzUk9UAAIE/gUHWAMECAcAAA==",
			//     "expire_seconds": 1800,
			//     "url": "http://weixin.qq.com/q/fjhb8J-laO4R83C7sROT",
			//     "show_qrcode_url": "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHk8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2ZqaGI4Si1sYU80UjgzQzdzUk9UAAIE%2FgUHWAMECAcAAA%3D%3D"
			// }

		}
	})

}


// 测试白名单
exports.cardTestwhitelist = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/testwhitelist/set?access_token='+access_token
	var openid = fs.readFileSync('./config/openid').toString();

	var formdata ={
		  "openid": [
		      "oV8Fpw9AZVRABxHNIovxIEew_znI",
		      "oV8Fpwwyk7xPurO4t2Okz8b1Lyzc"
		               ],
		  "username": [
		      "yangjunalns",
		      "jessicaandJason"
		                ]
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
				msg:'1',
				data:data
			})

		}
	})

}

// 删除会员卡
exports.cardDelete = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/delete?access_token='+access_token

	var formdata ={
					"card_id":config.card
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
				msg:'1',
				data:data
			})

		}
	})

}

// 更新会员卡信息
exports.cardUpdate = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/update?access_token='+access_token

	var formdata ={
			"card_id":config.card,
 			"member_card":{
	 				"supply_balance":false,
	 				
	 				 "wx_activate_after_submit" : true,
 					"wx_activate_after_submit_url" : "http://frankyoung.s1.natapp.link/wechat/info"  			
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
				msg:'1',
				data:data
			})

		}
	})

}

// 设置会员开卡字段
exports.cardMemberinfo = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/membercard/activateuserform/set?access_token='+access_token

	var formdata ={
			"card_id":config.card,
 			"service_statement": {
		        "name": "会员守则",
		        "url": ""
		    },
		    "bind_old_card": {
		        "name": "老会员绑定",
		        "url": ""
		    },
 			"required_form": {
		       	"common_field_id_list": [
		       		"USER_FORM_INFO_FLAG_NAME",
		            "USER_FORM_INFO_FLAG_MOBILE"
		            
		    	]		
			},
			"optional_form":{
				"can_modify":false,
		        "common_field_id_list": [
		            "USER_FORM_INFO_FLAG_LOCATION",
		            "USER_FORM_INFO_FLAG_BIRTHDAY"
		        ]
		        
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
				msg:'1',
				data:data
			})

		}
	})

}

// 拉取会员卡信息
exports.cardGetcard = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/get?access_token='+access_token

	var formdata = {
					"card_id":config.card
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
				msg:'1',
				data:data
			})

		}
	})

}

// 查询卡券信息
exports.cardGetDiscount = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/code/get?access_token='+access_token

	var formdata = {
		   "card_id" : config.card,
		   "code" : config.code,
		   "check_consume" : true
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
				msg:'1',
				data:data
			})

		}
	})

}



// 拉取会员信息---单个会员
exports.cardMembercard = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/membercard/userinfo/get?access_token='+access_token

	var formdata ={
			"card_id":config.card,
 			"code": config.code
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
			if(data.errcode ==0){
				var mobile = "",
					name ="",
					birthday ="",
					location =""
				if(data.user_info){
					data.user_info.common_field_list.forEach(function(v,i){
						if(v.name=="USER_FORM_INFO_FLAG_MOBILE"){
							mobile =  v.value
						}
						else if(v.name=="USER_FORM_INFO_FLAG_BIRTHDAY"){
							birthday =  v.value
						}else if(v.name=="USER_FORM_INFO_FLAG_NAME"){
							name =  v.value
						}else if(v.name=="USER_FORM_INFO_FLAG_LOCATION"){
							location =  v.value
						}

					})
					res.json({
						msg:'1',
						data:data
					})
				}

				
			}else if(data.errcode == 40056){
				res.json({
					status:0,
					msg:'会员卡号不存在！'
				})

			}
			else{
				res.json({
					status:0,
					msg:'发生一些错误',
					data:data.errcode
				})
			}
		}
	})

}

// 更新会员信息
exports.cardMembercardUpdate = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/membercard/updateuser?access_token='+access_token

	var formdata ={
 			"code": config.code,
			"card_id":config.card,
		    "record_bonus": "消费30元，获得3积分",
		    "bonus":103,
		    "balance":1,
		    "record_balance": "购买叶小妞一枚，一生陪着她。",
		    "notify_optional": {
		        "is_notify_bonus": true,
		        "is_notify_balance": true,
		        "is_notify_custom_field1":true
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
				msg:'1',
				data:data
			})

		}
	})

}

// 获取用户已领卡券
exports.cardUserGetcard = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/membercard/activateuserform/set?access_token='+access_token

	var formdata ={
					"card_id":config.card,
 			 			
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
				msg:'1',
				data:data
			})

		}
	})

}

// 微信推送信息接收url
exports.cardResponse = function(req,res){
	// user_get_card  领取事件推送
	// user_view_card 查看会员卡
	// user_del_card  删除事件推送
	// user_consume_card 核销事件推送
	// User_pay_from_pay_cell 买单事件推送
	// update_member_card 会员卡内容更新事件
	//  会员卡激活事件推送
	var access_token = fs.readFileSync('./config/token').toString()
	var url = 'https://api.weixin.qq.com/card/get?access_token='+access_token
	var msg = req.body.xml
	console.log(msg)
	var formdata ={
			"card_id":msg.cardid,
 			
		 }

	var options = {
	    url: url,
	    form: JSON.stringify(formdata),
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }
	}
	var date = new Date(),
		Y = date.getFullYear(),
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

	
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var carddata = JSON.parse(body)
			if(carddata.errcode ==0){
				
				// 打折券
				if(carddata.card.card_type == "DISCOUNT"){
					if(msg.event == "user_pay_from_pay_cell"){	
						var memberorder = {
								openid:msg.fromusername,
								shopid:msg.locationid,
								cardid:msg.cardid,
								code:parseInt(msg.usercardcode),
								originalfee:parseInt(msg.originalfee),
								transid:msg.transid,
								fee:parseInt(msg.fee),
								createtime:parseInt(msg.createtime),
								discount:parseInt(carddata.card.discount.discount),
								year:Y,
								month:M,
								day:D,
								status:1,
								billstatus:0
							}
							
							var _memberorder = new Memberorder(memberorder)
							_memberorder.save(function(err,memberorderdata){
								res.json({
										status:1,
										msg:"添加成功！"
									})
							})
					}
				}
				// 会员卡
				else if(carddata.card.card_type == "MEMBER_CARD"){
					//买单事件推送
					if(msg.event == "user_pay_from_pay_cell"){	

						var cardurl = 'https://api.weixin.qq.com/card/membercard/userinfo/get?access_token='+access_token

						var formdata = {
								"card_id":msg.cardid,
								"code": parseInt(msg.usercardcode)
							}

						var cardoptions = {
						    url: cardurl,
						    form: JSON.stringify(formdata),
						    headers: {
						      'Content-Type': 'application/x-www-form-urlencoded'
						    }
						}

						request.post(cardoptions, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								var data = JSON.parse(body)
								var mobile = "",
									name ="",
									birthday ="",
									location =""

									if(data.user_info){
										data.user_info.common_field_list.forEach(function(v,i){
											if(v.name=="USER_FORM_INFO_FLAG_MOBILE"){
												mobile =  v.value
											}
											else if(v.name=="USER_FORM_INFO_FLAG_BIRTHDAY"){
												birthday =  v.value
											}else if(v.name=="USER_FORM_INFO_FLAG_NAME"){
												name =  v.value
											}else if(v.name=="USER_FORM_INFO_FLAG_LOCATION"){
												location =  v.value
											}

										})
									}
								var memberorder = {
									openid:msg.fromusername,
									shopid:msg.locationid,
									username:name,
									cardid:msg.cardid,
									code:parseInt(msg.usercardcode),
									phone:mobile,
									originalfee:parseInt(msg.originalfee),
									transid:msg.transid,
									fee:parseInt(msg.fee),
									createtime:parseInt(msg.createtime),
									discount:parseInt(carddata.card.member_card.discount),
									year:Y,
									month:M,
									day:D,
									status:1,
									billstatus:0
								}
								
								var _memberorder = new Memberorder(memberorder)
								_memberorder.save(function(err,memberorderdata){
									if(err){
										console.log(err)
									}
									res.json({
											status:1,
											msg:"添加成功！"
										})
								})

							}
							
						})
				
					}
					// 激活会员卡,存入会员信息
					else if(msg.event == "submit_membercard_user_info"){	
						var cardurl = 'https://api.weixin.qq.com/card/membercard/userinfo/get?access_token='+access_token

						var formdata = {
								"card_id":msg.cardid
							}

						var cardoptions = {
						    url: cardurl,
						    form: JSON.stringify(formdata),
						    headers: {
						      'Content-Type': 'application/x-www-form-urlencoded'
						    }
						}

						request.post(cardoptions, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								var data = JSON.parse(body)
								var mobile = "",
									name ="",
									birthday ="",
									location =""

									if(data.user_info){
										data.user_info.common_field_list.forEach(function(v,i){
											if(v.name=="USER_FORM_INFO_FLAG_MOBILE"){
												mobile =  v.value
											}
											else if(v.name=="USER_FORM_INFO_FLAG_BIRTHDAY"){
												birthday =  v.value
											}else if(v.name=="USER_FORM_INFO_FLAG_NAME"){
												name =  v.value
											}else if(v.name=="USER_FORM_INFO_FLAG_LOCATION"){
												location =  v.value
											}

										})
									}

								var member = {
									cardid:msg.cardid,
									title:carddata.card.member_card.base_info.title,
									discount:parseInt(carddata.card.member_card.discount),
									openid:msg.fromusername,
									code:parseInt(msg.usercardcode),
									username:name,
									nickname:data.nickname,
									sex:data.sex,
									phone:mobile,
									birthday:birthday,
									location:location,
									user_card_status:data.user_card_status,
									has_active:data.has_active,
									bonus:data.bonus,
									fee:data.fee,
									balance:data.balance,
									createtime:msg.createtime
								}
								var _member = new Member(member)
									_member.save(function(err,memberdata){
										if(err){
											console.log(err)
										}
										res.json({
												status:1,
												msg:"添加成功！"
											})
									})


							}
						})
	
					}
				}
				// 代金券
				else if(carddata.card.card_type == "CASH"){
					if(msg.event == "user_pay_from_pay_cell"){	
						var memberorder = {
								openid:msg.fromusername,
								shopid:msg.locationid,
								cardid:msg.cardid,
								code:parseInt(msg.usercardcode),
								originalfee:parseInt(msg.originalfee),
								transid:msg.transid,
								fee:parseInt(msg.fee),
								createtime:parseInt(msg.createtime),
								discount:parseInt(carddata.card.cash.reduce_cost),
								year:Y,
								month:M,
								day:D,
								status:1,
								billstatus:0
							}
							
							var _memberorder = new Memberorder(memberorder)
							_memberorder.save(function(err,memberorderdata){
								res.json({
										status:1,
										msg:"添加成功！"
									})
							})
					}
				}
			}
			else if(carddata.errcode == 40056){
				res.json({
					status:0,
					msg:'会员卡号不存在！'
				})

			}
			else{
				res.json({
					status:0,
					msg:'发生一些错误'
				})
			}

		}
	})


}

// 查询门店信息
exports.cardGetShop = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/cgi-bin/poi/getpoilist?access_token='+access_token

	var formdata = {
				"begin":0,
				"limit":10
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
				msg:'1',
				data:data
			})

		}
	})

	//津京互联店   464246789
	//晋滨国际店   279080129
	//天软微吧店   464250970
	//天商微渡店   464041593

}















