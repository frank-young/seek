var https = require('https'),
	request = require('request'),
	fs = require('fs'),
	crypto = require('crypto')

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
	var app_id = "2016111002698733",
		method = "alipay.trade.pay",
		charset = "utf-8",
		sign_type = "RSA",
		timestamp = "2016-11-10 18:00:50",
		version ="1.0",
		biz_content ={"out_trade_no":"seek0120161110013","scene":"bar_code","auth_code":"28763443825664394","subject":"seek cafe消费","total_amount":0.01,"discountable_amount":0,"undiscountable_amount":0.01,"store_id":"seek02"}

	var string='app_id=2016111002698733&biz_content={"out_trade_no":"seek0120161110013","scene":"bar_code","auth_code":"28763443825664394","subject":"seek cafe消费","total_amount":0.01,"discountable_amount":0,"undiscountable_amount":0.01,"store_id":"seek02"}&charset=utf-8&method=alipay.trade.pay&sign_type=RSA&timestamp=2016-11-10 18:00:50&version=1.0'

	var privateKey = '-----BEGIN RSA PRIVATE KEY-----'+ "\r\n" + 'MIICXQIBAAKBgQD7qp2I0patUtin0M51n1E+/+bfIriFB4+kkpk6W+UxmJkwAzJOWJR9lrO2QxFbtaimDxpiNxxWbBxRZ1zEvrX3MfeVMnlF7LTiFErRmF3MfsM7H5DiDP6EFC6lrs8nsmXYaBJnIemvCXjatjqCbziudNCPdWTtgzWCMWFh+yRjDwIDAQABAoGAclWLCHQT/F5dC7Cze4CL2sFL1CfkCJvsyGnJr1e8gpG/Vq69FhbsLzpeHvnNUwruubK229QJzcGEA/+fh8rUw7iPakC+ON2dZMqhmYjrmOe/afJgG4NBJH8NpKQ8LVjvY8RlJr7UeDasaLIVcEdoyEjt3WtT76DbttdvzgMblmECQQD+zRWtHzvhKjYcYnrymqnD4bEe24BlEWruPmpezf9bLukXw3FM1jWXqzn1uex3SumyxidDnWVMxlpso8HI3IOHAkEA/NnBQrrBDG8ESbTizzIEsaBv1PpkDT2YiTpmzYM7untjC8p0I39fJEcBFLYC5jC7txpCSKOD1oT2dQN23baWOQJAHp4AI8xkApty4xhGU86X5azB/sY7eGmOYtBnMbspGwjZA3z9qVD4IaB2l3te2brLuCqtXyeTm5UeGn3W9E7jEwJBAPAOmXKONixk1lBYISIP3e76YFJ3Kzh663AV93ZUiweAj8eo/dyZ2C1sEDWmnFgJmp67moS2YbvwXsE3ecoDyNkCQQCy2jZaeE5X4gA1AQDKzE2poaS6gTZUrEaHEciQoUCA6vLIVTuvNr0IfBv/P21QxS6zCGKtoqpOaJ0vI0KdRXJg'+ "\r\n" + '-----END RSA PRIVATE KEY-----'

	var sign = crypto.createSign('RSA-SHA1').update(string,'utf8').sign(privateKey, 'base64')

	var url = 'https://openapi.alipay.com/gateway.do?timestamp='+timestamp+'&method=alipay.trade.pay&app_id='+app_id+'&sign_type=RSA&sign='+sign+'&version=1.0&biz_content='+biz_content
	
		request(url, function (error, response, body) {
		  	if (!error && response.statusCode == 200) {
		    	console.log(JSON.parse(body)) 
		    	console.log(body)
			}
		})
		
}