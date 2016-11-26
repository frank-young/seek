var https = require('https'),
	request = require('request'),
	fs = require('fs'),
	crypto = require('crypto'),
	Alipayorder = require('../../models/alipay/alipayorder')
	

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
	var sales = req.body.sales
	var user = req.session.user
	var device_info = sales.device_info
	//公共请求参数
	var params = {}
	params.app_id = "2016111002698733",   // 正式->2016111002698733    测试->2016101000649056
	params.method = "alipay.trade.pay",
	params.charset = "utf-8",
	params.sign_type = "RSA",
	params.timestamp = createTime().timetamp,
	params.version ="1.0"

	var auth_code = sales.auth_code,
		out_trade_no = sales.out_trade_no,
		store_id = user.domain,
		subject = "seek cafe",
		total_amount = sales.total_fee

	var biz_content = {"auth_code":auth_code,"out_trade_no":out_trade_no,"scene":"bar_code","store_id":store_id,"subject":subject,"total_amount":total_amount}

	var signedParams = rsa(params,biz_content)

	var url = 'https://openapi.alipay.com/gateway.do?'+signedParams+"&biz_content="+JSON.stringify(biz_content)
	options = {
	    url: url,
	    method:'post',
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }
	}
	
	request.post(options, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  		var body = JSON.parse(body),
	  			data = body.alipay_trade_pay_response,
	  			sign = body.sign
	  		console.log(data)
	    	if(data.code === '10000'){
	    		//存库
	    		saveAliayorder(data,device_info,user.name,user.email,user.domain,res)	
	    	}else if(data.code === '10003'){
	    		res.json({
					status:2,
					msg: data.sub_msg
				})
	    	}else{
	    		res.json({
					status:0,
					msg: data.sub_msg
				})
	    	}
		}
	})
	
}

//查询订单
exports.orderquery = function(req,res){
	var sales = req.body.sales
	var user = req.session.user
	var device_info = sales.device_info
	//公共请求参数
	var params = {}
	params.app_id = "2016111002698733",   // 正式->2016111002698733    测试->2016101000649056
	params.method = "alipay.trade.query",
	params.charset = "utf-8",
	params.sign_type = "RSA",
	params.timestamp = createTime().timetamp,
	params.version ="1.0"

	var out_trade_no = sales.out_trade_no

	var biz_content = {"out_trade_no":out_trade_no}

	var signedParams = rsa(params,biz_content)

	var url = 'https://openapi.alipay.com/gateway.do?'+signedParams+"&biz_content="+JSON.stringify(biz_content)
	options = {
	    url: url,
	    method:'post',
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }
	}
	
	request.post(options, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  		var body = JSON.parse(body),
	  			data = body.alipay_trade_pay_response,
	  			sign = body.sign
	  		console.log(data)
	    	if(data.code === '10000'){
	    		//存库
	    		saveAliayorder(data,device_info,user.name,user.email,user.domain,res)	
	    	}else{
	    		res.json({
					status:0,
					msg: data.sub_msg
				})
	    	}
		}
	})
	
}


//加密
function rsa(params,biz_content){
	//用了params 和 biz_content 对象，更简洁的传值、拼接
	//注意对 biz_content对象字符串化
	// 第一步，拼接字符串 ，按照字母升序
	var string='app_id='+params.app_id+'&biz_content='+JSON.stringify(biz_content)+'&charset='+params.charset+'&method='+params.method+'&sign_type='+params.sign_type+'&timestamp='+params.timestamp+'&version='+params.version
	// 第二步，引入私钥文件
	var private_key = fs.readFileSync('./rsa/rsa_private_key.pem').toString()
	// 第三步，加密生成sign
	params.sign = crypto.createSign('RSA-SHA1').update(string).sign(private_key, 'base64')
	var qs = require('querystring')
	//返回加密后待sign的 urlencoded
	return qs.stringify(params)
}

// 将支付信息存入 payorder数据库
function saveAliayorder(data,device_info,name,email,domain,res){
	//解析价格类型
	data.buyer_pay_amount = parseFloat(data.buyer_pay_amount)
	data.invoice_amount = parseFloat(data.invoice_amount)
	data.point_amount = parseFloat(data.point_amount)
	data.receipt_amount = parseFloat(data.receipt_amount)
	data.total_amount = parseFloat(data.total_amount)
	data.device_info = device_info
	data.username = name
	data.userlocal = email
	data.domainlocal = domain
	data.year = createTime().Y
	data.month = createTime().M
	data.day = createTime().D

	var	_alipayorder = new Alipayorder(data)
	_alipayorder.save(function(err,data){
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

function createTime(){
	var date = new Date(),
		Y = date.getFullYear(),	
	    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()),
	    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()),
	    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()),
	    s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds())

	return {
		Y:Y,
		M:M,
		D:D,
		h:h,
		m:m,
		s:s,
		timetamp:Y+'-'+M+'-'+D+' '+h+':'+m+':'+s
	}

}












