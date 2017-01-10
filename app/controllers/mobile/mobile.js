'use strict'

let Cook = require('../../models/dish/cook'),
    Cate = require('../../models/dish/cate'),
    Item = require('../../models/order/item'),
    Order = require('../../models/order/order'),
    Domain = require('../../models/domain'),
    request = require('request'),
    _ = require('underscore'),
    fs = require('fs'),
    async = require('async'),
    WXPay = require('weixin-pay')

let wxpay = WXPay({
    appid: 'wx782db8ee3e80c4aa',
    mch_id: '1295261101',
    partner_key: 'seekbrandseekcafe521521521521521', //微信商户平台API密钥
    pfx: fs.readFileSync('./rsa/wechat/apiclient_cert.p12'), //微信商户平台证书
})

//构建微信点餐数据
exports.goods = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")

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

                            if(i === len - 1) {
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
                        orderObj.time = new Date() - 0,
                        orderObj.year = Y,
                        orderObj.month = M,
                        orderObj.day = D,
                        orderObj.domainlocal = domain

                        _order = new Order(orderObj)

                        _order.save((err, order) => {
                            if (err) {
                                console.log(err)
                            } else {
                                cb(null)
                            }
                        })
                    }
                })
            },
            (cb) => {
                let arr = [],
                    dish = orderObj.dish,
                    len = dish.length

                for(let i = 0; i< len; i++){
                    let itemObj = {
                        isTop:false,
                        isChecked:false,
                        name: dish[i].name,
                        cate: dish[i].cate,
                        price: Math.round(dish[i].price*100)/100,
                        reducePrice: Math.round(dish[i].reducePrice*100)/100,
                        number: dish[i].number, 
                        dishArr: dish[i].dishArr,
                        total:Math.round(dish[i].number * dish[i].reducePrice*100)/100,
                        time:Date.now(),
                        year: Y,
                        month: M,
                        day: D,
                        orderNum:orderObj.orderNum
                    }
                    

                    let _item = new Item(itemObj)

                    _item.save((err, order) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    
                    if(i === len - 1) {
                        cb(null, arr)
                    }
                }
            }

        ], (err) => {
            if(err){
                res.json({
                    status: 0,
                    data:"发生错误"
                })
            } else {
                res.json({ msg: "添加成功", status: 1 })
            }
        })   
    }
}

exports.wxpay = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By",' 3.2.1')

    let openid = req.query.openid
    let ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
    console.log(ip)
    wxpay.getBrandWCPayRequestParams({
        openid: openid,
        body: '公众号支付测试',
        detail: '公众号支付测试',
        out_trade_no: '20150331'+Math.random().toString().substr(2, 10),
        total_fee: 1,
        spbill_create_ip: ip,
        notify_url: 'http://192.168.31.217:3000/wechat/init'
    }, function(err, result){
        // in express
        res.json({
            status: 1,
            data: result
        })
    })

}

exports.ticket = (req, res) => {
    let access_token = fs.readFileSync('./config/token').toString()
    let url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi'

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            let ticket = JSON.parse(body).ticket
            fs.writeFile('./config/ticket', ticket, function(err) {
                res.json({
                    status: 1,
                    msg: '获取成功！',
                    data: JSON.parse(body)
                })
            })
        }
    })
}

exports.signa = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By",' 3.2.1')

    let jsapi_ticket = fs.readFileSync('./config/ticket').toString()

    let noncestr = (parseInt(Math.random() * new Date() - 0)).toString(32),
        timestamp = Math.ceil((new Date() - 0)/1000),
        url = 'http://frank.d1.natapp.cc/'

    let signature = signjsapi(noncestr, jsapi_ticket, timestamp, url)
    console.log(signature)
    res.json({
        status: 1,
        data: {
            'appId': 'wx782db8ee3e80c4aa',
            'timestamp': timestamp,
            'nonceStr': noncestr,
            'signature': signature,
            'jsapi_ticket': jsapi_ticket
        }
    })
}

//签名算法 - 支付
// function signjsapi(timeStamp, nonceStr, package, signType) {
//     var ret = {
//         timeStamp: timeStamp,
//         nonceStr: nonceStr,
//         package: package,
//         signType: signType
//     }
//     var string = raw1(ret)
//     var crypto = require('crypto')
//     console.log(string)
//     return crypto.createHash('sha1').update(string, 'utf8').digest('hex').toLowerCase()
// }

//签名算法 - 验证
function signjsapi(noncestr, jsapi_ticket, timestamp, url) {
    var ret = {
        noncestr: noncestr,
        jsapi_ticket: jsapi_ticket,
        timestamp: timestamp,
        url: url
    }
    var string = raw1(ret)
    var crypto = require('crypto')
    console.log(string)
    return crypto.createHash('sha1').update(string, 'utf8').digest('hex').toLowerCase()
}

//序列化
function raw1(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {}
    keys.forEach(function(key) {
        newArgs[key] = args[key]
    })
    var string = ''
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1)
    return string
}















