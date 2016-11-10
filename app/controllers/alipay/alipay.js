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
	params.app_id = "2016111002698733",   // 正式->2016111002698733    测试->2016101000649056
	params.method = "alipay.trade.pay",
	params.charset = "utf-8",
	params.sign_type = "RSA",
	params.timestamp = "2016-11-10 18:00:50",
	params.version ="1.0"
	var biz_content ={"out_trade_no":"seek0120161110013","scene":"bar_code","auth_code":"28763443825664394","subject":"seek cafe","total_amount":0.01,"discountable_amount":0,"undiscountable_amount":0.01,"store_id":"seek02"}

	var string='app_id='+params.app_id+'&biz_content='+JSON.stringify(biz_content)+'&charset='+params.charset+'&method='+params.method+'&sign_type='+params.sign_type+'&timestamp='+params.timestamp+'&version='+params.version

	var private_key = fs.readFileSync('./rsa/rsa_private_key.pem')

	params.sign = crypto.createSign('RSA-SHA1').update(string).sign(private_key, 'base64')
	// params.sign = crypto.createHash('md5').update(string, params.charset).digest("hex")

	var signedParams = qs.stringify(params)

	params.biz_content = biz_content
	var url = 'https://openapi.alipay.com/gateway.do?'+signedParams+"&biz_content="+biz_content
	options = {
	    url: url,
	    method:'post',
	    form: JSON.stringify(params),
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }
	}
	// console.log(signedParams)
	
	request.post(options, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	    	console.log(JSON.parse(body)) 
	    	console.log(body)
		}
	})
		
}












