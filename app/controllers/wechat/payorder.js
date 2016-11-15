var Payorder = require('../../models/wechat/payorder'),
	_ = require('underscore')

	//今日微信支付
	exports.todayPayorder = function(req, res) {
		var device_info = req.params.id
		var date = new Date(),
			Y = date.getFullYear(),
        	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
        	D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		Payorder.fetch({"device_info":device_info,"year":Y,"month":M,"day":D},function(err,orders){
			var wxpospay = 0
			orders.forEach(function(ele){
				wxpospay += parseInt(ele.cash_fee)/100
			})
			res.json({
					status:1,
					msg:"读取成功",
					wxpospay:wxpospay
				})

		})
	}

	// 按日期的微信支付
	exports.somePayorder = function(req, res) {
		var device_info = req.params.id,
			date = req.params.date
		var Y = date.substr(0,4),
			M = date.substr(4,2),
			D = date.substr(6,2)

		Payorder.fetch({"device_info":device_info,"year":Y,"month":M,"day":D},function(err,orders){
			var wxpospay = 0
			orders.forEach(function(ele){
				wxpospay += parseInt(ele.cash_fee)/100
			})
			res.json({
					status:1,
					msg:"读取成功",
					wxpospay:wxpospay
				})

		})
	}










