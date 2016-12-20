'use strict'

let Cook = require('../../models/dish/cook'),
    Cate = require('../../models/dish/cate'),
    Item = require('../../models/order/item'),
    Order = require('../../models/order/order'),
    Domain = require('../../models/domain'),
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

exports.order = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By",' 3.2.1')

    let domain = "seek02"

    let orderObj = req.body.order,
        _order,
        rePrice = /^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$/

    let date = new Date(),
        Y = date.getFullYear(),
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())

    console.log(orderObj)

    if (orderObj.total == "" || orderObj.total == null) {
        res.json({
            status: 0,
            msg: "总价不能为空！"
        })
    } else {
        async.waterfall([
            (cb) => {
                Domain.findOne({name:domain},function(err,data){
                    cb(null, data)
                })
            },
            (data, cb) => {
                Order.findOne({ orderNum: orderObj.orderNum }, (err, order) => {
                    if (err) {
                        res.json({
                            status: 0,
                            msg: "发生未知错误！",
                            err: err
                        })
                    }
                    if (order) {
                        res.json({
                            status: 0,
                            msg: "订单已经存在！"
                        })
                    } else {
                        orderObj.name = data.name,
                        orderObj.pname = data.pname,
                        orderObj.address = data.address,
                        orderObj.tel = data.tel,
                        orderObj.year = Y,
                        orderObj.month = M,
                        orderObj.day = D,
                        orderObj.domainlocal = domain

                        _order = new Order(orderObj)

                        _order.save((err, order) => {
                            if (err) {
                                console.log(err)
                            } else {
                                res.json({ msg: "添加成功", status: 1 })
                            }
                        })
                    }
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

}















