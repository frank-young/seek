let Cook = require('../../models/dish/cook'),
    Cate = require('../../models/dish/cate'),
    Item = require('../../models/order/item'),
    _ = require('underscore'),
    fs = require('fs'),
    async = require('async')


//构建微信点餐数据
exports.goods = (req, res) => {
	let domain = "seek02"
	let arr = []
    async.waterfall([
        (cb) => {
        	Cate.fetch({"domainlocal": domain},(err,cates) => {
        		cates.forEach((cate) => {
        			let obj = {}
        			obj.name = cate.label
        			obj.type = -1
        			obj.foods = []
        			arr.push(obj)
        		})

				cb(null, arr)
			})
        },
        (arr, cb) => {
            Cook.fetch({ "domainlocal": domain }, (err, goods) => {
            	goods.forEach((good) => {
            		let obj = {}
            		obj.name = good.name
            		obj.price = good.price
            		obj.sellCount = 0
            		obj.description = good.description
            		arr[good.cate].foods.push(obj)
            	})
		        cb(null, arr)
		    })
        },
        (arr, cb) => {
        	let date = new Date(),
		        Y = date.getFullYear(),
		        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
		    
		    arr.forEach((value) => {
        		value.foods.forEach((food) => {
        			Item.fetch({ "domainlocal": domain,"name": food.name, "year": Y, "month":M}, (err, items) => {
            			food.sellCount = items.length
            			console.log(items.length)
        				console.log(food.sellCount)
        				console.log('------------------')
		    		})
        		})
        		console.log(value)
        	})
	        cb(null, arr)
        }
    ], (err, result) => {
        console.log('err => ' + err)
        res.json({
        	errno: 0,
        	data:result
        })
    })
    
}













