var jsSHA = require('jssha'),
	https = require('https'),
	request = require('request'),
	fs = require('fs'),
	Memberorder = require('../../models/wechat/memberorder')
	Member = require('../../models/wechat/member')
	Payorder = require('../../models/wechat/payorder')
	Petcard = require('../../models/member/petcard')
	

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
	card: "pQw7gvyLUU7yuy7eEdaut-GlxPyA",
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

//获取自动回复规则
exports.getcgi = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString()
	var url = 'https://api.weixin.qq.com/cgi-bin/get_current_autoreply_info?access_token=' + access_token

	request(url, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  		res.json({
		      	status:1,
				msg:'获取成功！',
				data:body
		      })
	  	}
	})
}

//读取自定义菜单
exports.getmenu = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString()
	var url = 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=' + access_token

	request(url, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  		res.json({
		      	status:1,
				msg:'读取自定义菜单成功！',
				data:body
		      })
	  	}
	})
}

//添加菜单
exports.addmenu = function(req,res){

	//token，因为token是存在文件里的所以这里进行文件读取得到token
	var access_token = fs.readFileSync('./config/token').toString()
	var menus = {
	  "button":[{
			"name":"微官网",
			"sub_button":[
			{"type":"view",
			"name":"首页",
			"url":"http:\/\/55735016.m.weimob.com\/weisite\/home?pid=55735016&bid=56673821&wechatid=fromUsername&_tt=2&channel=menu%5E%23%5E6aaW6aG1","sub_button":[]},
			{"type":"view","name":"申请会员","url":"https:\/\/mp.weixin.qq.com\/cgi-bin\/showqrcode?ticket=gQFY8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0UwU3V0empsWDJjbUxJQ1ppMl9IAAIEb9gyWAMEgDPhAQ%3D%3D","sub_button":[]},{"type":"view","name":"品牌故事","url":"http:\/\/55735016.m.weimob.com\/WEISITE\/detail?did=2534329&bid=56673821&pid=55735016","sub_button":[]},{"type":"view","name":"在线订购","url":"http:\/\/55735016.m.weimob.com\/dining\/info\/showStoreListPage?pid=55735016&wechatid=fromUsername&menu=ONLINE_ORDERING&_tt=2&channel=menu%5E%23%5E5Zyo57q\/6K6i6LSt","sub_button":[]},{"type":"view","name":"积分查询","url":"http:\/\/55735016.m.weimob.com\/Webnewmemberscore\/index?pid=55735016&wechatid=fromUsername&_tt=2&channel=menu%5E%23%5E56ev5YiG5p+l6K+i","sub_button":[]}]},{"name":"会员消息","sub_button":[{"type":"view","name":"最新活动","url":"http:\/\/55735016.m.weimob.com\/weisite\/list?pid=55735016&bid=56673821&wechatid=fromUsername&ltid=1739279&wxref=mp.weixin.qq.com&_tt=2&channel=menu%5E%23%5E5pyA5paw5rS75Yqo","sub_button":[]},{"type":"view","name":"优惠信息","url":"http:\/\/55735016.m.weimob.com\/weisite\/list?pid=55735016&bid=56673821&wechatid=fromUsername&ltid=1738517&wxref=mp.weixin.qq.com&_tt=2&channel=menu%5E%23%5E5LyY5oOg5L+h5oGv","sub_button":[]},{"type":"click","name":"抢优惠","key":"刮刮卡","sub_button":[]},{"type":"click","name":"创业求助","key":"求助","sub_button":[]},{"type":"view","name":"微信打印机","url":"http:\/\/prtv3.etbar.com\/uweb\/index.aspx?userid=1311&ucode=AsBSkMLRgD1o","sub_button":[]}]},{"name":"关于我们","sub_button":[{"type":"view","name":"门店信息","url":"http:\/\/55735016.m.weimob.com\/weisite\/list?pid=55735016&bid=56673821&wechatid=fromUsername&ltid=1818666&wxref=mp.weixin.qq.com&_tt=2&channel=menu%5E%23%5E6Zeo5bqX5L+h5oGv","sub_button":[]},{"type":"click","name":"商务合作","key":"商务合作","sub_button":[]},{"type":"view","name":"诚邀加盟","url":"http:\/\/55735016.m.weimob.com\/webreserve\/ReserveBook?rid=71459&pid=55735016&wechatid=fromUsername&_tt=2&channel=menu%5E%23%5E6K+a6YKA5Yqg55uf","sub_button":[]},{"type":"view","name":"推荐选址","url":"http:\/\/55735016.m.weimob.com\/webreserve\/ReserveBook?rid=71460&pid=55735016&wechatid=fromUsername&_tt=2&channel=menu%5E%23%5E5o6o6I2Q6YCJ5Z2A","sub_button":[]},{"type":"view","name":"意见反馈","url":"http:\/\/55735016.m.weimob.com\/webreserve\/ReserveBook?rid=71464&pid=55735016&wechatid=fromUsername&_tt=2&channel=menu%5E%23%5E5oSP6KeB5Y+N6aaI","sub_button":[]}]}]
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
 				"base_info": {
             		"pay_info":{
                    "swipe_card":{
                    	"is_swipe_card":true
                     	}
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
	var code = req.params.code
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/membercard/userinfo/get?access_token='+access_token

	var formdata ={
			"card_id":config.card,
 			"code": code
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
						data:data,
						mobile:mobile,
						name:name,
						birthday:birthday
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
		    "record_bonus": "",
		    "bonus":103,
		    "balance":1,
		    "record_balance": "",
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
	var msg = req.body.xml

	// 消息处理类型
	if(msg.msgtype == 'text'){
		//消息自动回复
		if(msg.content == '西可咖啡'){
			content = '<a href="https://hd.faisco.cn/10865156/6/load.html?style=0">点击参与活动</a> '
			msgReplay(msg,res,content)
		}else if(msg.content == '会员'){
			content = "<a href='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQFY8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0UwU3V0empsWDJjbUxJQ1ppMl9IAAIEb9gyWAMEgDPhAQ%3D%3D'>点击查看领取会员卡二维码</a>"
			msgReplay(msg,res,content)
		}else{
			res.end('')
		}
		
		console.log(msg)
	}else{
	//其他事件处理类型
		console.log(msg)
		var url = 'https://api.weixin.qq.com/card/get?access_token='+access_token
		
		var formdata ={
				"card_id":msg.cardid
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

		// 领会员卡，这里是当作取储值卡
		if(msg.event == "user_get_card"){
			if(msg.cardid==='pQw7gvyLUU7yuy7eEdaut-GlxPyA'){
				console.log('领取了储值卡')
					
			}
		}

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
									code:msg.usercardcode,
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
									"code": msg.usercardcode
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
										code:msg.usercardcode,
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
									"card_id":msg.cardid,
									"code": msg.usercardcode
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

									
									if(msg.cardid==='pQw7gvyLUU7yuy7eEdaut-GlxPyA'){
										console.log('激活储值卡')
										var content = '恭喜您，成功激活了seek cafe储值卡，请将卡号告诉收银员，进行充值！'
										msgReplay(msg,res,content)
										var petcardObj = {
											cardid:msg.cardid,
											title:carddata.card.member_card.base_info.title,
											openid:msg.fromusername,
											code:msg.usercardcode,
											username:name,
											nickname:data.nickname,
											sex:data.sex,
											phone:mobile,
											birthday:birthday,
											location:location,
											status:1,
											has_active:true,
											card_grade:0,
											discount:0,
											int:0,
											bonus:data.bonus,
											fee:data.fee,
											balance:data.balance,
											createtime:msg.createtime
										}
										Petcard.findOne({"code":msg.usercardcode},function(err,codedata){
											if(codedata){
												res.json({
													status:0,
													msg:"已经领取过储值卡了！"
												})
											}else{
												var _petcard
												_petcard = new Petcard(petcardObj)
												_petcard.save(function(err,petcard){
													if(err){
														console.log(err)
													}
													res.json({msg:"添加成功",status: 1})
												})

											}
										})
											
									}else{
										var member = {
											cardid:msg.cardid,
											title:carddata.card.member_card.base_info.title,
											discount:parseInt(carddata.card.member_card.discount),
											openid:msg.fromusername,
											code:msg.usercardcode,
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
									code:msg.usercardcode,
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

}


//消息回复函数
function msgReplay(msg,res,content){
	res_data = '<xml>'+
				'<ToUserName><![CDATA['+msg.fromusername+']]></ToUserName>'+
				'<FromUserName><![CDATA['+msg.tousername+']]></FromUserName>'+
				'<CreateTime>'+parseInt(new Date().valueOf()/1000)+'</CreateTime>'+
				'<MsgType><![CDATA[text]]></MsgType>'+
				'<Content><![CDATA['+content+']]></Content>'+
				'</xml>'
		res.writeHead(200, {'Content-Type': 'application/xml'})
		res.end(res_data)
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


// 刷卡支付
exports.pay = function(req,res){
	var sales = req.body.sales
	var user = req.session.user 

	var appid = config.wechat.appID
	var mch_id = '1295261101'	
	var key = 'seekbrandseekcafe521521521521521'
	var total_fee = sales.total_fee*100	// -- 传递  sales.total_fee
	var auth_code = sales.auth_code  
	var attach = user.domain	 
	var body_info = 'seekcafe'
	var device_info = sales.device_info	
	var nonce_str = 'ibuaiVcKdpRxkhJA'
	var out_trade_no = sales.out_trade_no		
	var spbill_create_ip = '60.205.157.200'

	wechatpospay()
	//刷卡支付
	function wechatpospay(){
		//签名
		var sign = paysignjsapi(appid,attach,auth_code,body_info,device_info,mch_id,nonce_str,out_trade_no,spbill_create_ip,total_fee,key)  //'0F38072A948D438518CCC57424C457EC'
		var url = 'https://api.mch.weixin.qq.com/pay/micropay'

		var formdata = "<xml>"
		formdata += "<appid>"+appid+"</appid>"
		formdata +=	"<attach>"+attach+"</attach>"
		formdata += "<auth_code>"+auth_code+"</auth_code>"
		formdata += "<body>"+body_info+"</body>"
		formdata += "<device_info>"+device_info+"</device_info>"
		formdata += "<mch_id>"+mch_id+"</mch_id>"
		formdata += "<nonce_str>"+nonce_str+"</nonce_str>"
		formdata += "<out_trade_no>"+out_trade_no+"</out_trade_no>"
		formdata += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>"
		formdata += "<total_fee>"+total_fee+"</total_fee>"
		formdata += "<sign>"+sign+"</sign>"
		formdata += "</xml>"

		var options = {
		    url: url,
		    body: formdata,
		    headers: {'Content-Type': 'text/xml'}
		}

		request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
				var return_code = getXMLNodeValue('return_code',body.toString("utf-8"))	
				var return_msg = getXMLNodeValue('return_msg',body.toString("utf-8"))	

				if(return_code === "SUCCESS" ){
					var result_code = getXMLNodeValue('result_code',body.toString("utf-8"))
					if(result_code === "SUCCESS"){
						//储存payorder订单函数
						savePayorder(user.name,user.email,user.domain,body,res)
						
					}else{
						var err_code_des = getXMLNodeValue('err_code_des',body.toString("utf-8"))
						var err_code = getXMLNodeValue('err_code',body.toString("utf-8"))
						if(err_code === 'USERPAYING'){	//需要输入支付密码
							res.json({
								status:2,
								msg:err_code_des
							})
						}else{
							res.json({
								status:0,
								msg:err_code_des
							})

						}
					}
				}
				else{
					res.json({
						status:0,
						msg:return_msg
					})
				} 	
			}
		})
	}


	function paysignjsapi(appid,attach,auth_code,body,device_info,mch_id,nonce_str,out_trade_no,spbill_create_ip,total_fee,key) {
	    var ret = {
	        appid: appid,
	        attach:attach,
	        auth_code:auth_code,
	        body: body,
	        device_info: device_info,
	        mch_id: mch_id,
	        nonce_str: nonce_str,
	        out_trade_no:out_trade_no,
	        spbill_create_ip:spbill_create_ip,
	        total_fee:total_fee
	    }
	    var string = raw1(ret)
	    string = string + '&key='+key
	    var crypto = require('crypto')
	    return crypto.createHash('md5').update(string,'utf8').digest('hex').toUpperCase()
	}

}

// 查询订单，如果用户需要输入密码，要用到此接口去查询订单判断状态
exports.orderquery = function(req,res){
	var sales = req.body.sales
	var user = req.session.user 

	var appid = config.wechat.appID,
		mch_id = '1295261101',
		key = 'seekbrandseekcafe521521521521521',
		nonce_str = 'ibuaiVcKdpRxkhJA',
		out_trade_no = sales.out_trade_no		// -- 传递

	wechatorderquery()

	// 查询订单，用于需要支付密码的用户
	function wechatorderquery(){
		//签名
		var sign = ordersignjsapi(appid,mch_id,nonce_str,out_trade_no)
		var url = 'https://api.mch.weixin.qq.com/pay/orderquery'

		var formdata = "<xml>"
		formdata += "<appid>"+appid+"</appid>"
		formdata += "<mch_id>"+mch_id+"</mch_id>"
		formdata += "<nonce_str>"+nonce_str+"</nonce_str>"
		formdata += "<out_trade_no>"+out_trade_no+"</out_trade_no>"
		formdata += "<sign>"+sign+"</sign>"
		formdata += "</xml>"

		var options = {
		    url: url,
		    body: formdata,
		    headers: {'Content-Type': 'text/xml'}
		}

		request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
				var return_code = getXMLNodeValue('return_code',body.toString("utf-8"))	
				var return_msg = getXMLNodeValue('return_msg',body.toString("utf-8"))	

				if(return_code === "SUCCESS" ){
					var result_code = getXMLNodeValue('result_code',body.toString("utf-8"))
					if(result_code === "SUCCESS"){
						var trade_state = getXMLNodeValue('trade_state',body.toString("utf-8"))	

						if(trade_state === "SUCCESS"){
							savePayorder(user.name,user.email,user.domain,body,res)
						}else if(trade_state === "NOTPAY"){
							res.json({
								status:0,
								msg:"未支付!"
							})

						}else if(trade_state === "USERPAYING"){
							res.json({
								status:0,
								msg:"用户支付中!"
							})
						}else if(trade_state === "PAYERROR"){
							res.json({
								status:0,
								msg:"支付失败!"
							})
						}else if(trade_state === "REVOKED"){
							res.json({
								status:0,
								msg:"已撤销!"
							})
						}


					}else{
						var err_code_des = getXMLNodeValue('err_code_des',body.toString("utf-8"))
						res.json({
							status:0,
							msg:err_code_des
						})
						
					}
				}
				else{
					res.json({
						status:0,
						msg:return_msg
					})
				} 	
			}
		})
	}

	// md5加密算法
	function ordersignjsapi(appid,mch_id,nonce_str,out_trade_no) {
	    var ret = {
	        appid: appid,
	        mch_id: mch_id,
	        nonce_str: nonce_str,
	        out_trade_no:out_trade_no
	    }
	    var string = raw1(ret)
	    string = string + '&key='+key
	    var crypto = require('crypto')
	    return crypto.createHash('md5').update(string,'utf8').digest('hex').toUpperCase()
	}

}

//序列化
function raw1(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key] = args[key]
  })
  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1)
  return string
}

//解析xml 字符串
function getXMLNodeValue(node_name,xml){
    if(node_name !==""||node_name !==null){
    	var tmp = xml.split("<"+node_name+"><![CDATA[");
    	var _tmp = tmp[1].split("]]></"+node_name+">");
    	return _tmp[0];
    }
}
//解析xml 数字
function getXMLNumberValue(node_name,xml){
    if(node_name !==""||node_name !==null){
    	var tmp = xml.split("<"+node_name+">");
    	var _tmp = tmp[1].split("</"+node_name+">");
    	return _tmp[0];
    }
}

// 将支付信息存入 payorder数据库
function savePayorder(name,email,domain,body,res){
	var payorderobj = {}
		//解析所需要的xml
		payorderobj.openid = getXMLNodeValue('openid',body.toString("utf-8"))
		payorderobj.device_info = getXMLNodeValue('device_info',body.toString("utf-8"))
		payorderobj.is_subscribe = getXMLNodeValue('is_subscribe',body.toString("utf-8"))
		payorderobj.bank_type = getXMLNodeValue('bank_type',body.toString("utf-8"))
		payorderobj.total_fee = getXMLNumberValue('total_fee',body.toString("utf-8"))
		payorderobj.transaction_id = getXMLNodeValue('transaction_id',body.toString("utf-8"))
		payorderobj.out_trade_no = getXMLNodeValue('out_trade_no',body.toString("utf-8"))
		payorderobj.attach = getXMLNodeValue('attach',body.toString("utf-8"))
		payorderobj.time_end = getXMLNodeValue('time_end',body.toString("utf-8"))
		payorderobj.cash_fee = getXMLNumberValue('cash_fee',body.toString("utf-8"))
		payorderobj.year = payorderobj.time_end.substr(0,4)
		payorderobj.month = payorderobj.time_end.substr(4,2)
		payorderobj.day = payorderobj.time_end.substr(6,2)
		payorderobj.username = name
		payorderobj.userlocal = email
		payorderobj.domainlocal = domain
		
		//存入 payorderobj 数据库
		var	_payorder = new Payorder(payorderobj)
		_payorder.save(function(err,data){
			if(err){
				console.log(err)
			}else{
				res.json({
					status:1,
					msg:"付款成功!"
				})
			}
			
		})
}








