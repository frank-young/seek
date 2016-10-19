var jsSHA = require('jssha')
var https = require('https')
var request = require('request')
var fs = require('fs')

var config = {
	wechat:{
		appID:'wx782db8ee3e80c4aa',			//wxd95a4f3e82e0df64
		appSecret:'07edc09a46dba2e8d0b1964b5aec3a46',		//143d36866e792512dc76ea5d11e8df62
		token:'weixin'
	}
}

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

	var refreshToken = function () {
	  saveToken()
	  setInterval(function () {
	    saveToken()
	  }, 7000*1000)
	}
	refreshToken()
}


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

	var data = {
		"card": {
	        "card_type": "MEMBER_CARD",
	        "member_card": {
	            "background_pic_url": "",
	            "base_info": {
	                "logo_url": "http://y7gr8.ngrok.natapp.cn/img/logo.jpg",
	                "brand_name": "Seek Cafe",
	                "code_type": "CODE_TYPE_QRCODE",
	                "title": "Seek Cafe会员卡",
	                "color": "Color010",
	                "notice": "使用时向服务员出示此券",
	                "service_phone": "022-8365486",
	                "description": "不可与其他优惠同享",
	                "date_info": {
	                    "type": "DATE_TYPE_PERMANENT"
	                },
	                "sku": {
	                    "quantity": 100
	                },
	                "get_limit": 20,
	                "use_custom_code": false,
	                "can_give_friend": true,
	                "location_id_list": [
	                    123,
	                    12321
	                ],
	                "use_all_locations": true,
	                "center_title":"微信买单",
	                "center_url":"http://weixin.qq.com",
	                "custom_url_name": "立即使用",
	                "custom_url": "http://weixin.qq.com",
	                "custom_url_sub_title": "6个汉字tips",
	                "promotion_url_name": "营销入口1",
	                "promotion_url": "http://www.qq.com",
	                "need_push_on_view": true
	            },
	            "supply_bonus": true,
	            "supply_balance": false,
	            "prerogative": "test_prerogative",
	            "wx_activate": true,
	            "custom_field1": {
	                "name_type": "FIELD_NAME_TYPE_DISCOUNT",
	                "url": "http://www.qq.com"
	            },
				"supply_balance":true,
	            // "custom_field2": {
	            //     "name_type": "FIELD_NAME_TYPE_COUPON",
	            //     "url": "http://www.qq.com"
	            // },
	            "activate_url": "http://www.qq.com",
	            "custom_cell1": {
	                "name": "使用入口2",
	                "tips": "激活后显示",
	                "url": "http://www.xxx.com"
	            },
	            "bonus_rule": {
	                "cost_money_unit": 100,
	                "increase_bonus": 1,
	                "max_increase_bonus": 200,
	                "init_increase_bonus": 10,
	                "cost_bonus_unit": 5,
	                "reduce_money": 100,
	                "least_money_to_use_bonus": 1000,
	                "max_reduce_bonus": 50
	            },
	            "discount": 10
	        }
    	}
	}

	var options = {
	    url: url,
	    form: JSON.stringify(data),
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

	var data ={
			"action_name": "QR_CARD", 
			"expire_seconds": 1800,
			"action_info": {
				"card": {
					"card_id": "pV8Fpw6zJmvsJ0NYGysLFE2_Wt24", 
					"code": "198374613512"
					
				 }
			}
		}

	var options = {
	    url: url,
	    form: JSON.stringify(data),
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

	var data ={
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
	    form: JSON.stringify(data),
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

// 测试白名单
exports.cardDelete = function(req,res){
	var access_token = fs.readFileSync('./config/token').toString();
	var url = 'https://api.weixin.qq.com/card/delete?access_token='+access_token

	var data ={
 			"card_id": "pV8Fpw8-qFZKbBEvHWPg6ETT1Q7I"
		 }

	var options = {
	    url: url,
	    form: JSON.stringify(data),
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

	var data ={
 			"card_id": "pQw7gv3-fLxpHzSpU1Yl21r1ukrE",
 			"member_card":{
	 				"supply_balance":true

 			}
 			 			
		 }

	var options = {
	    url: url,
	    form: JSON.stringify(data),
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
















