var Table = require('../../models/table/table')
var Tableorder = require('../../models/table/tableorder')
var _ = require('underscore')
var qr = require('qr-image')

//储值卡规则列表页
exports.list = function(req, res) {
    var user = req.session.user
    Table.fetch({ "domainlocal": user.domain }, function(err, tables) {
        res.json({
            status: "1",
            msg: "操作成功",
            tables: tables
        })
    })
}

exports.save = function(req, res) {
    var tableObj = req.body.table
    var user = req.session.user

    tableObj.userlocal = user.email
    tableObj.domainlocal = user.domain

    var _table
    _table = new Table(tableObj)
    _table.save(function(err, table) {
        if (err) {
            console.log(err)
        }
        res.json({ msg: "添加成功", status: 1 })
    })
}

exports.update = function(req, res) {
    var id = req.body.table._id
    var tableObj = req.body.table
    var _table
    if (id !== "undefined") {
        Table.findById(id, function(err, table) {
            if (err) {
                console.log(err)
            }
            _table = _.extend(table, tableObj)
            _table.save(function(err, table) {
                if (err) {
                    console.log(err)
                }

                res.json({ msg: "更新成功", status: 1 })
            })
        })
    }

}

exports.detail = function(req, res) {
    var id = req.params.id
    Table.findById(id, function(err, table) {
        res.json({
            table: table
        })
    })
}

//获取点餐桌号
exports.num = function(req, res) {
    var id = req.params.id
    Table.findById(id, function(err, table) {
        res.json({
            status: 1,
            num: table.num
        })
    })
}

//创建二维码
exports.qrcode = function(req, res) {
    var text = req.query.text;
    try {
        var img = qr.image(text, { size: 20 });
        res.writeHead(200, { 'Content-Type': 'image/png' });
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, { 'Content-Type': 'text/html' });
        res.end('<h1>发生错误...</h1>');
    }
}

//模拟点餐首页
exports.ordering = function(req, res) {
    var id = req.params.id

    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd95a4f3e82e0df64&redirect_uri=http%3A%2F%2Fy7gr8.ngrok.natapp.cn%2Fmobile%2Fordering&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect

    // var code = req.query.codeta
    // 用获取code换取token
    // var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.wechat.appID + '&secret=' + config.wechat.appSecret + '&code=' + code + '&grant_type=authorization_code'
    // var saveToken = function() {
    //     request(url, function(error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             var data = JSON.parse(body)
    //             var token = data.access_token
    //             var refresh_token = data.refresh_token
    //             var openid = data.openid

    //             fs.writeFile('./config/web_token', token, function(err) {})
    //             fs.writeFile('./config/refresh_token', refresh_token, function(err) {})
    //             fs.writeFile('./config/openid', openid, function(err) {})

                Table.findById(id, function(err, table) {
                    if (table) {
                        res.render('wechat/wxorder',{
                            status: 1,
                            num: table.num,
                            domain: table.domainlocal
                        })
                    } else {
                        res.json({
                            status: 0,
                            msg: '扫描失败，请重新扫描二维码！'
                        })
                    }
                })

    //         } else {
    //             res.json({
    //                 status: 0,
    //                 msg: '已经授权过了'
    //             })

    //         }
    //     })
    // }
    // saveToken()

}

//查询是否有新订单
exports.query = function(req, res) {
    var domain = req.params.id
    Tableorder.fetch({ 'domainlocal': domain, 'status': 1 }, function(err, orders) {
        if (orders.length !== 0) {
            res.json({
                status: 1,
                number: orders.length,
                orders: orders
            })
        } else {
            res.json({
                status: 0
            })
        }
    })
}

//修改新订单状态为已查看
exports.edit = function(req, res) {
    var id = req.params.id
    var tableObj = {}
    tableObj.status = 2

    Tableorder.findById(id, function(err, table) {
        if (err) {
            console.log(err)
        }

        _table = _.extend(table, tableObj)
        _table.save(function(err, data) {
            if (err) {
                console.log(err)
            }
            res.json({ msg: "更新成功", status: 1 })
        })
    })
}


exports.del = function(req, res) {
    var id = req.query.id
    if (id) {
        Table.remove({ _id: id }, function(err, table) {
            if (err) {
                console.log(err)
            } else {
                res.json({ status: 1, msg: "删除成功" })
            }
        })
    }
}
