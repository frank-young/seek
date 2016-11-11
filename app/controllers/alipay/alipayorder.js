var alipayorder = require('../../models/alipay/alipayorder'),
	_ = require('underscore')

	exports.todayAlipayorder = function(req, res) {
		var device_info = req.params.id
		var date = new Date(),
			Y = date.getFullYear(),
        	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
        	D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		alipayorder.fetch({"device_info":device_info,"year":Y,"month":M,"day":D},function(err,orders){
			var alipospay = 0
			orders.forEach(function(ele){
				alipospay += ele.receipt_amount
			})
			res.json({
					status:1,
					msg:"读取成功",
					alipospay:alipospay
				})

		})
	}










