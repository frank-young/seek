var jsSHA = require('jssha')
var https = require('https')
var request = require('request')

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
	https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wechat.appID+'&secret='+config.wechat.appSecret, (res) =>{
	  console.log('statusCode: ', res.statusCode);
	  console.log('headers: ', res.headers);
	  console.log(res)
	  res.on('data', (d) => {
	    var data = process.stdout.write(d)
	    console.log(data)
	  })

	}).on('error', (e) => {  console.error(e)})

}


exports.addMenu = function(req,res){
	var access_token = "KguplMgbxO9ZjgxubgCAhxuH0TAUnMWStE4hgdy_F5OzNLn9QIVShplb2HXXtC3MLmZq09zUvE4Y9PL6j5NiMzZEAUM5YREj5AAt8Ttg4BgxypPUmlmaENByxsDUnfE7OPQfAHAJKL"
	var menus = {
	  "button": [
	    {
	      "name": "测试菜单",
	      "sub_button": [
	        {
	          "type": "view",
	          "name": "哈哈哈哈",
	          "url": "http://www.google.com"
	        }]
	    }]
	}
	var options = {
	    url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + access_token,
	    form: JSON.stringify(menus),
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }
	  };
	  
	  request.post(options, function (err, res, body) {
	    if (err) {
	      console.log(err)
	    }else {
	      console.log(body);
	    }
	  })
}

















