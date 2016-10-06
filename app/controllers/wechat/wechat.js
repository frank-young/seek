var jsSHA = require('jssha')
var https = require('https')
var request = require('request')
var fs = require('fs')

var config = {
	wechat:{
		appID:'wxd95a4f3e82e0df64',
		appSecret:'143d36866e792512dc76ea5d11e8df62',
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
	  };
	  
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
				console.log('tiaozhuan')

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

















