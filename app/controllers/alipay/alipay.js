var https = require('https'),
	request = require('request'),
	fs = require('fs'),
	crypto = require('crypto'),
	qs = require('querystring')

//应用网关
exports.init = function(req,res){
	var xml = req.body.xml
	console.log(xml)
}

//回掉url
exports.callback = function(req,res){
	var xml = req.body.xml
	console.log(xml)
}

//条码支付，刷卡支付
exports.pospay = function(req,res){
	//公共请求参数
	var params = {}
	params.app_id = "2016101000649056",   // 正式->2016111002698733    测试->2016101000649056
	params.method = "alipay.trade.pay",
	params.charset = "utf-8",
	params.sign_type = "RSA",
	params.timestamp = "2016-11-10 18:00:50",
	params.version ="1.0"
	var biz_content = {"auth_code":"282455177872545515","discountable_amount":0,"out_trade_no":"seek0120161110013","scene":"bar_code","store_id":"seek02","subject":"seek cafe","total_amount":0.01,"undiscountable_amount":0.01}

	var string='app_id='+params.app_id+'&biz_content='+JSON.stringify(biz_content)+'&charset='+params.charset+'&method='+params.method+'&sign_type='+params.sign_type+'&timestamp='+params.timestamp+'&version='+params.version

	var private_key = fs.readFileSync('./rsa/rsa_private_key.pem').toString()

	params.sign = crypto.createSign('RSA-SHA1').update(string).sign(private_key, 'base64')

	var signedParams = qs.stringify(params)

	var url = 'https://openapi.alipaydev.com/gateway.do?'+signedParams+"&biz_content="+JSON.stringify(biz_content)
	options = {
	    url: url,
	    method:'post',
	    // form: JSON.stringify(params),
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }
	}
	console.log(url)
	
	request.post(options, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	    	console.log(JSON.parse(body)) 
	    	console.log(body)
		}
	})
		
}












