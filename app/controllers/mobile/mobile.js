'use strict'

let Cook = require('../../models/dish/cook'),
    Cate = require('../../models/dish/cate'),
    Item = require('../../models/order/item'),
    _ = require('underscore'),
    fs = require('fs'),
    async = require('async')


//构建微信点餐数据
exports.goods = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const HOT_NUM = 10
    const HOT_NAME = '热销菜品'

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
                let hotObj = {
                    "name": HOT_NAME,
                    "type": 2,
                    "foods": []
                }
                arr.unshift(hotObj)
				cb(null, arr)
			})
        },
        (arr, cb) => {
            let date = new Date(),
                Y = date.getFullYear(),
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)

            Cook.fetch({ "domainlocal": domain }, (err, goods) => {
                let len = goods.length

                for(let i = 0; i< len; i++){
                    ((i) => {
                        Item.fetch({ "domainlocal": domain,"name": goods[i].name, "year": Y, "month":M}, (err, items) => {
                            let itemsLen = items.length,
                                count = 0
                            for(let j = 0;j < itemsLen; j++) {
                                count += items[j].number

                                if(count >= HOT_NUM) {
                                    let hotGoods = {
                                        "name": items[j].name,
                                        "price": items[j].price,
                                        "sellCount": count,
                                        "description": ""
                                    }
                                    arr[0].foods.push(hotGoods)
                                }
                            }

                            let obj = {}
                            let cateNum = parseInt(goods[i].cate) + 1
                            obj.name = goods[i].name
                            obj.price = goods[i].price
                            obj.sellCount = count
                            obj.description = goods[i].description
                            arr[cateNum].foods.push(obj)

                            if(i == len-1) {
                                cb(null, arr)
                            }
                        })
                    })(i)
                }
		    })   
        },
        (arr,cb) => {
            // 热销菜品的添加
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
        }
    ], (err, result) => {
        if(err){
            res.json({
                errno: 1000,
                data:"发生错误"
            })
        } else {
            res.json({
                errno: 0,
                data:result
            })

        }
    })
    
}














